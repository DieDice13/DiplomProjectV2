// Reviews.tsx
import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS_BY_PRODUCT } from '../../graphql/queries/reviews';
import AddReviewForm from './AddReviewForm';
import { motion, AnimatePresence } from 'framer-motion';
import RatingStars from './RatingStars';

interface ReviewsProps {
  productId: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: number | string;
  user?: {
    name?: string;
  };
}

const formatTimestamp = (raw: number | string | null | undefined): string => {
  if (raw == null) return '—';
  const num = typeof raw === 'number' ? raw : Number(raw);
  if (Number.isNaN(num)) return '—';
  const ms = num > 1e12 ? num : num * 1000;
  const date = new Date(ms);
  if (isNaN(date.getTime())) return '—';
  return date
    .toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', '');
};

const Reviews: FC<ReviewsProps> = ({ productId }) => {
  const { data, loading, error } = useQuery(GET_REVIEWS_BY_PRODUCT, {
    variables: { productId },
    fetchPolicy: 'cache-and-network',
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  const reviews: Review[] = useMemo(() => data?.reviewsByProduct ?? [], [data]);

  if (loading) return <p>Загрузка отзывов...</p>;
  if (error) return <p>Ошибка загрузки отзывов</p>;

  return (
    <div className="space-y-6 mt-6 w-full max-w-[1000px] mx-auto px-4 sm:px-6">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold">Отзывы</h3>
        {!isFormVisible && (
          <button
            onClick={() => setIsFormVisible(true)}
            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 mt-3"
          >
            Написать отзыв
          </button>
        )}
      </div>

      {isFormVisible && (
        <AddReviewForm productId={productId} onCancel={() => setIsFormVisible(false)} />
      )}

      <AnimatePresence>
        {reviews.length > 0 ? (
          reviews.map(review => {
            const formattedDate = formatTimestamp(review.createdAt);
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
                className="border p-4 rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{review.user?.name ?? 'Пользователь'}</span>
                  <RatingStars rating={review.rating} />
                </div>
                {/* Исправленный блок текста отзыва */}
                <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">
                  {review.comment}
                </p>
                <span className="text-xs text-gray-400">{formattedDate}</span>
              </motion.div>
            );
          })
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500"
          >
            Отзывов пока нет — будьте первым!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reviews;
