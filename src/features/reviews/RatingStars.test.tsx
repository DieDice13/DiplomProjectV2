import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RatingStars from './RatingStars';

describe('RatingStars', () => {
  it('рендерит 5 звезд по умолчанию', () => {
    render(<RatingStars rating={0} />);
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);
  });

  it('подсвечивает звезды в соответствии с рейтингом', () => {
    render(<RatingStars rating={3} />);
    const stars = screen.getAllByText('★');

    expect(stars[0]).toHaveClass('text-yellow-400');
    expect(stars[1]).toHaveClass('text-yellow-400');
    expect(stars[2]).toHaveClass('text-yellow-400');

    expect(stars[3]).toHaveClass('text-gray-300');
    expect(stars[4]).toHaveClass('text-gray-300');
  });

  it('вызывает onHover при наведении, если interactive=true', () => {
    const onHover = vi.fn();
    render(<RatingStars rating={0} interactive onHover={onHover} />);
    const stars = screen.getAllByText('★');

    fireEvent.mouseEnter(stars[1]);
    expect(onHover).toHaveBeenCalledWith(2);

    fireEvent.mouseLeave(stars[1]);
    expect(onHover).toHaveBeenCalledWith(null);
  });

  it('вызывает onClick при клике на звезду, если interactive=true', () => {
    const onClick = vi.fn();
    render(<RatingStars rating={0} interactive onClick={onClick} />);
    const stars = screen.getAllByText('★');

    fireEvent.click(stars[3]);
    expect(onClick).toHaveBeenCalledWith(4);
  });
});
