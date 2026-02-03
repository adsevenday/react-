import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  it('renders card with name', () => {
    render(<Card name="Test Book" />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  it('renders card with author', () => {
    render(<Card name="Book" author="Test Author" />);
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('renders book cover image', () => {
    render(<Card name="Book" bookCover="/image.jpg" />);
    const image = screen.getByAltText('Book');
    expect(image).toHaveAttribute('src', '/image.jpg');
  });

  it('renders period when provided', () => {
    render(<Card name="Book" period="2020" />);
    expect(screen.getByText('2020')).toBeInTheDocument();
  });

  it('renders reference number', () => {
    render(<Card name="Book" reference="REF123" />);
    expect(screen.getByText(/Réf/)).toBeInTheDocument();
  });
});
