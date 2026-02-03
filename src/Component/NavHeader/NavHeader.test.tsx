import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavHeader from './NavHeader';

describe('NavHeader Component', () => {
  const mockOnSearch = jest.fn();
  const logoProps = { imageSrc: '/logo.png', href: '/' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation', () => {
    render(
      <BrowserRouter>
        <NavHeader logo={logoProps} onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('renders logo', () => {
    render(
      <BrowserRouter>
        <NavHeader logo={logoProps} onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders advanced search link', () => {
    render(
      <BrowserRouter>
        <NavHeader logo={logoProps} onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    expect(screen.getByText('Recherche avancée')).toBeInTheDocument();
  });

  it('renders search bar', () => {
    render(
      <BrowserRouter>
        <NavHeader logo={logoProps} onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('Chercher un livre...')).toBeInTheDocument();
  });

  it('calls onSearch when search submitted', () => {
    render(
      <BrowserRouter>
        <NavHeader logo={logoProps} onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    const input = screen.getByPlaceholderText('Chercher un livre...');
    fireEvent.change(input, { target: { value: 'test book' } });
    const button = screen.getByRole('button', { name: /🔍/ });
    fireEvent.click(button);
    expect(mockOnSearch).toHaveBeenCalledWith('test book');
  });
});
