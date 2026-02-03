import { render } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders footer', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('renders phone number when provided', () => {
    render(<Footer number="0123456789" />);
    const link = document.querySelector('a[href="tel:0123456789"]');
    expect(link).toBeInTheDocument();
  });
});
