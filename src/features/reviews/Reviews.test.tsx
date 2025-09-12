import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@apollo/client';
import Reviews from './Reviews';

// правильный мок apollo — оставляем всё, кроме useQuery
vi.mock('@apollo/client', async importOriginal => {
  const actual = await importOriginal<typeof import('@apollo/client')>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

// мок формы добавления отзыва
vi.mock('./AddReviewForm', () => ({
  default: ({ onCancel }: { onCancel?: () => void }) => (
    <div data-testid="mock-form">
      <p>Mocked AddReviewForm</p>
      {onCancel && (
        <button onClick={onCancel} data-testid="cancel-btn">
          Cancel
        </button>
      )}
    </div>
  ),
}));

describe('Reviews', () => {
  const mockUseQuery = vi.mocked(useQuery);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('показывает состояние загрузки', () => {
    mockUseQuery.mockReturnValue({
      loading: true,
      error: undefined,
      data: undefined,
    } as any);

    render(<Reviews productId={1} />);
    expect(screen.getByText(/Загрузка отзывов/i)).toBeInTheDocument();
  });

  it('показывает состояние ошибки', () => {
    mockUseQuery.mockReturnValue({
      loading: false,
      error: new Error('boom'),
      data: undefined,
    } as any);

    render(<Reviews productId={1} />);
    expect(screen.getByText(/Ошибка загрузки/i)).toBeInTheDocument();
  });

  it('показывает сообщение, если отзывов нет', () => {
    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: { reviewsByProduct: [] },
    } as any);

    render(<Reviews productId={1} />);
    expect(screen.getByText(/Отзывов пока нет — будьте первым/i)).toBeInTheDocument();
  });

  it('рендерит список отзывов', () => {
    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        reviewsByProduct: [
          {
            id: 1,
            rating: 4,
            comment: 'Хороший товар',
            createdAt: 1694000000,
            user: { name: 'Иван' },
          },
          {
            id: 2,
            rating: 5,
            comment: 'Отлично',
            createdAt: 1695000000000, // миллисекунды
            user: {},
          },
        ],
      },
    } as any);

    render(<Reviews productId={1} />);
    expect(screen.getByText('Иван')).toBeInTheDocument();
    expect(screen.getByText('Хороший товар')).toBeInTheDocument();
    expect(screen.getByText('Пользователь')).toBeInTheDocument();
    expect(screen.getByText('Отлично')).toBeInTheDocument();
  });

  it('открывает и закрывает форму добавления отзыва', () => {
    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: { reviewsByProduct: [] },
    } as any);

    render(<Reviews productId={1} />);
    const btn = screen.getByRole('button', { name: /Написать отзыв/i });
    fireEvent.click(btn);

    expect(screen.getByTestId('mock-form')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('cancel-btn'));
    expect(screen.queryByTestId('mock-form')).not.toBeInTheDocument();
  });
});
