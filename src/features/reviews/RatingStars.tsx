import type { FC } from 'react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  interactive?: boolean;
  hoverRating?: number | null;
  onHover?: (value: number | null) => void;
  onClick?: (value: number) => void;
}

const RatingStars: FC<RatingStarsProps> = ({
  rating,
  max = 5,
  interactive = false,
  hoverRating,
  onHover,
  onClick,
}) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, idx) => {
        const star = idx + 1;
        const isFilled = interactive ? (hoverRating ?? rating) >= star : rating >= star;
        return (
          <span
            key={star}
            className={`text-2xl cursor-${interactive ? 'pointer' : 'default'} transition-colors ${
              isFilled ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onMouseEnter={() => interactive && onHover?.(star)}
            onMouseLeave={() => interactive && onHover?.(null)}
            onClick={() => interactive && onClick?.(star)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default RatingStars;
