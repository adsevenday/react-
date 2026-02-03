import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Logo from './Logo';

describe('Logo Component', () => {
  it('renders logo image', () => {
    render(
      <BrowserRouter>
        <Logo imageSrc="/logo.png" href="/" />
      </BrowserRouter>
    );
    const image = screen.getByAltText('Logo');
    expect(image).toBeInTheDocument();
  });

  it('logo image has correct src', () => {
    render(
      <BrowserRouter>
        <Logo imageSrc="/logo.png" href="/" />
      </BrowserRouter>
    );
    const image = screen.getByAltText('Logo');
    expect(image).toHaveAttribute('src', '/logo.png');
  });

  it('renders logo with custom alt text', () => {
    render(
      <BrowserRouter>
        <Logo imageSrc="/logo.png" href="/" alt="My Logo" />
      </BrowserRouter>
    );
    const image = screen.getByAltText('My Logo');
    expect(image).toBeInTheDocument();
  });
});
