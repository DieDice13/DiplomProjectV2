// AddReviewForm.tsx
import { useState } from 'react';
import type { FC } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_REVIEW } from '../../graphql/mutations/reviews';
import { GET_REVIEWS_BY_PRODUCT } from '../../graphql/queries/reviews';
import { useAppSelector } from '../../hooks/useAppSelector';
import RatingStars from './RatingStars';

interface AddReviewFormProps {
  productId: number;
  onCancel?: () => void;
}

const AddReviewForm: FC<AddReviewFormProps> = ({ productId, onCancel }) => {
  const { user } = useAppSelector(state => state.auth);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState<number | null>(null);

  const [addReview, { loading }] = useMutation(ADD_REVIEW, {
    refetchQueries: [{ query: GET_REVIEWS_BY_PRODUCT, variables: { productId } }],
  });

  if (!user) {
    return (
      <p className="mt-4 text-sm text-gray-600">
        Чтобы оставить отзыв,{' '}
        <a href="/login" className="text-green-600 underline">
          войдите в аккаунт
        </a>
        .
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0) return;
    try {
      await addReview({ variables: { productId, rating, comment } });
      setComment('');
      setRating(0);
      if (onCancel) onCancel();
    } catch (err) {
      console.error('Ошибка при добавлении отзыва:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-gray-100 py-10 px-6 rounded-lg shadow-md w-full mx-auto max-w-[900px] sm:max-w-[95%] lg:max-w-[850px]"
    >
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-[var(--site-selector)] text-sm font-medium"
        >
          Отмена
        </button>
      )}

      <div className="flex flex-col items-start mb-6">
        <span className="text-sm text-gray-600 mb-2">Выберите рейтинг товара *</span>
        <RatingStars
          rating={rating}
          interactive
          hoverRating={hover}
          onHover={setHover}
          onClick={setRating}
        />
      </div>

      <div className="mb-6 w-full">
        <label className="block text-sm mb-2">Отзыв *</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="px-4 py-3 w-full bg-white outline-none rounded-md resize-none text-sm"
          placeholder="Ваш отзыв"
          rows={7}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full bg-[var(--site-selector)] text-white py-3 rounded hover:bg-[var(--site-selector-hover)] disabled:opacity-50"
      >
        {loading ? 'Отправка...' : 'Оставить отзыв'}
      </button>

      <p className="text-xs text-gray-500 mt-3">Перед публикацией отзывы проходят модерацию</p>
    </form>
  );
};

export default AddReviewForm;
