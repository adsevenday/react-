// filepath: c:\Users\adric\Nouveau dossier\react-\src\pages\Home.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { OpenLibraryService } from '../api/openLibrary';

// Mock des dépendances
jest.mock('../api/openLibrary');
jest.mock('../Component/NavHeader/NavHeader', () => ({ logo, onSearch }: any) => (
  <div data-testid="nav-header">
    <button onClick={() => onSearch('test query')}>Search</button>
  </div>
));
jest.mock('../Component/Footer/Footer', () => () => <div data-testid="footer" />);
jest.mock('../Component/Card/Card', () => ({ name, author, bookCover, period }: any) => (
  <div data-testid="card">{name} by {author}</div>
));

const mockOpenLibraryService = OpenLibraryService as jest.Mocked<typeof OpenLibraryService>;

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    mockOpenLibraryService.getBooksBySubject.mockResolvedValue({ works: [] });
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByTestId('nav-header')).toBeInTheDocument();
  });

  test('fetches and displays trending books on mount', async () => {
    const mockBooks = [
      { key: '/works/1', title: 'Book 1', author_name: ['Author 1'], first_publish_year: 2020 },
    ];
    mockOpenLibraryService.getBooksBySubject.mockResolvedValue({ works: mockBooks });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Les nouveaux arrivants')).toBeInTheDocument();
      expect(screen.getByText('Book 1 by Author 1')).toBeInTheDocument();
    });
  });

  test('handles search from nav bar', async () => {
    const mockSearchResults = [
      { key: '/works/2', title: 'Search Book', author_name: ['Search Author'], first_publish_year: 2021 },
    ];
    mockOpenLibraryService.getBooksBySubject.mockResolvedValue({ works: [] });
    mockOpenLibraryService.advancedSearch.mockResolvedValue({ docs: mockSearchResults });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockOpenLibraryService.advancedSearch).toHaveBeenCalledWith({ title: 'test query' });
      expect(screen.getByText('Résultats de recherche')).toBeInTheDocument();
      expect(screen.getByText('Search Book by Search Author')).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    mockOpenLibraryService.getBooksBySubject.mockRejectedValue(new Error('API Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Erreur lors du chargement des nouveautés :", expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});