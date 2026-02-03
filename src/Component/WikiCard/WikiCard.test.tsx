import { render, screen } from '@testing-library/react';
import WikiCard from './WikiCard';

describe('WikiCard Component', () => {
  it('renders wiki card with description', () => {
    render(
      <WikiCard
        description="Test description"
        link="https://wikipedia.org"
      />
    );
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders link to Wikipedia', () => {
    render(
      <WikiCard
        description="Test"
        link="https://wikipedia.org/wiki/Test"
      />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://wikipedia.org/wiki/Test');
  });

  it('renders "Read more" text', () => {
    render(
      <WikiCard
        description="Test"
        link="https://wikipedia.org"
      />
    );
    expect(screen.getByText('Read more')).toBeInTheDocument();
  });
});
