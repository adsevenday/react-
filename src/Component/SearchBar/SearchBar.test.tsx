import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input with placeholder', () => {
    render(
      <SearchBar
        value=""
        onChange={jest.fn()}
        onSearch={mockOnSearch}
        placeholder="Search..."
      />
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('calls onSearch when Enter is pressed', () => {
    render(
      <SearchBar
        value="test"
        onChange={jest.fn()}
        onSearch={mockOnSearch}
      />
    );
    const input = screen.getByDisplayValue('test');
    fireEvent.keyUp(input, { key: 'Enter' });
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  it('calls onSearch when search button is clicked', () => {
    render(
      <SearchBar
        value="test"
        onChange={jest.fn()}
        onSearch={mockOnSearch}
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  it('renders search icon button', () => {
    render(
      <SearchBar
        value=""
        onChange={jest.fn()}
        onSearch={mockOnSearch}
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
