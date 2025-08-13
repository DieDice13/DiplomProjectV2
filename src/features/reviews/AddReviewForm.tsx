import { useState } from 'react';
import type { FC } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_REVIEW } from '../../graphql/mutations/reviews';
import { GET_REVIEWS_BY_PRODUCT } from '../../graphql/queries/reviews';
import { useAppSelector } from '../../hooks/useAppSelector';

interface AddReviewFormProps {
  productId: number;
  onCancel?: () => void;
}

const AddReviewForm: FC<AddReviewFormProps> = ({ productId, onCancel }) => {
  const { user } = useAppSelector(state => state.auth);
  const [rating, setRating] = useState(5);
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
    if (!comment.trim()) return;

    try {
      await addReview({
        variables: { productId, rating, comment },
      });
      setComment('');
      setRating(5);
      if (onCancel) onCancel();
    } catch (err) {
      console.error('Ошибка при добавлении отзыва:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 py-6 px-4 mt-4 max-w-xl mx-auto">
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`text-3xl cursor-pointer ${
              (hover || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          >
            ★
          </span>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Отзыв *</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="px-3 py-2 w-full bg-white outline-none"
          placeholder="Ваш отзыв"
          rows={4}
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-500 text-white py-2 hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Отправка...' : 'Оставить отзыв'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-800 py-2 hover:bg-gray-400"
          >
            Отмена
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">Перед публикацией отзывы проходят модерацию</p>
    </form>
  );
};

export default AddReviewForm;
