import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddReviewForm from './AddReviewForm';

let mockUser: any = { id: 1, name: 'Тестовый пользователь' };
const addReviewMock = vi.fn();

// мок аполло useMutation
vi.mock('@apollo/client', () => {
  return {
    useMutation: () => [addReviewMock, { loading: false }],
    gql: vi.fn(),
  };
});

// мок useAppSelector
vi.mock('../../hooks/useAppSelector', () => ({
  useAppSelector: (fn: any) => fn({ auth: { user: mockUser } }),
}));

describe('AddReviewForm', () => {
  beforeEach(() => {
    mockUser = { id: 1, name: 'Тестовый пользователь' };
    addReviewMock.mockReset();
  });

  it('показывает приглашение войти, если user = null', () => {
    mockUser = null;
    render(<AddReviewForm productId={123} />);
    expect(screen.getByText(/Чтобы оставить отзыв/i)).toBeInTheDocument();
  });

  it('рендерит форму, если user авторизован', () => {
    render(<AddReviewForm productId={123} />);
    expect(screen.getByText(/Выберите рейтинг товара/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ваш отзыв/i)).toBeInTheDocument();
  });

  it('кнопка отправки дизейблится без рейтинга', () => {
    render(<AddReviewForm productId={123} />);
    const button = screen.getByRole('button', { name: /Оставить отзыв/i });
    expect(button).toBeDisabled();
  });

  it('разблокируется кнопка после ввода рейтинга и текста', () => {
    render(<AddReviewForm productId={123} />);
    const stars = screen.getAllByText('★');
    const textarea = screen.getByPlaceholderText(/Ваш отзыв/i);
    const button = screen.getByRole('button', { name: /Оставить отзыв/i });

    fireEvent.click(stars[4]); // ставим 5 звезд
    fireEvent.change(textarea, { target: { value: 'Отличный товар!' } });

    expect(button).not.toBeDisabled();
  });

  it('вызов onCancel работает', () => {
    const onCancel = vi.fn();
    render(<AddReviewForm productId={123} onCancel={onCancel} />);
    const cancelBtn = screen.getByRole('button', { name: /Отмена/i });
    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalled();
  });

  it('вызывает addReview при сабмите', async () => {
    addReviewMock.mockResolvedValue({});

    render(<AddReviewForm productId={123} />);
    const stars = screen.getAllByText('★');
    const textarea = screen.getByPlaceholderText(/Ваш отзыв/i);
    const button = screen.getByRole('button', { name: /Оставить отзыв/i });

    fireEvent.click(stars[2]); // 3 звезды
    fireEvent.change(textarea, { target: { value: 'Нормальный' } });
    fireEvent.submit(button);

    await waitFor(() => {
      expect(addReviewMock).toHaveBeenCalledWith({
        variables: { productId: 123, rating: 3, comment: 'Нормальный' },
      });
    });
  });
});
