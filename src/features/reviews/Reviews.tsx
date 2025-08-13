import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REVIEWS_BY_PRODUCT } from '../../graphql/queries/reviews';
import AddReviewForm from './AddReviewForm';

interface ReviewsProps {
  productId: number;
}

const formatTimestamp = (raw: any): string => {
  if (raw === null || raw === undefined) return '—';

  // Преобразуем в число (timestamp)
  const num = typeof raw === 'number' ? raw : Number(raw);
  if (Number.isNaN(num)) return '—';

  // Преобразуем в миллисекунды, если timestamp в секундах
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
    variables: { productId: Number(productId) },
    fetchPolicy: 'cache-and-network',
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    if (data?.reviewsByProduct) {
      console.log(
        'DEBUG: reviews raw ->',
        data.reviewsByProduct.map((r: any) => ({
          id: r.id,
          createdAt: r.createdAt,
          typeof: typeof r.createdAt,
        })),
      );
    }
  }, [data]);

  if (loading) return <p>Загрузка отзывов...</p>;
  if (error) return <p>Ошибка загрузки отзывов</p>;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold">Отзывы</h3>
        {!isFormVisible && (
          <button
            onClick={() => setIsFormVisible(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
          >
            Написать отзыв
          </button>
        )}
      </div>

      {isFormVisible && (
        <AddReviewForm productId={productId} onCancel={() => setIsFormVisible(false)} />
      )}

      {data?.reviewsByProduct?.length ? (
        data.reviewsByProduct.map((review: any) => {
          const formattedDate = formatTimestamp(review.createdAt);

          return (
            <div key={review.id} className="border p-3 rounded-lg shadow-sm bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{review.user?.name ?? 'Пользователь'}</span>
                <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
              </div>
              <p className="text-sm text-gray-700">{review.comment}</p>
              <span className="text-xs text-gray-400">{formattedDate}</span>
            </div>
          );
        })
      ) : (
        <p>Отзывов пока нет — будьте первым!</p>
      )}
    </div>
  );
};

export default Reviews;
