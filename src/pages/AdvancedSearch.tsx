import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OpenLibraryService } from '../api/openLibrary';
import { Link } from 'react-router-dom';
import Card from '../Component/Card/Card';
import NavHeader from '../Component/NavHeader/NavHeader';
import Footer from '../Component/Footer/Footer';
import './advancedSearch.scss';

function AdvancedSearch() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ title: '', author: '', subject: '' });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const title = searchParams.get('title');
    if (title) {
      setForm({ title, author: '', subject: '' });
      performSearch({ title, author: '', subject: '' });
    }
  }, [searchParams]);

  const performSearch = async (searchForm: typeof form) => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(searchForm).filter(([_, v]) => v !== '')
      );
      const data = await OpenLibraryService.advancedSearch(activeFilters);
      setResults(data.docs || []);
    } catch (error) {
      console.error("Erreur recherche avancée:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(form);
  };

  const handleSearch2 = async (query: string) => {
    const newForm = { ...form, title: query };
    setForm(newForm);
    if (query.trim()) {
      await performSearch(newForm);
    }
  };

  return (
    <>
      <NavHeader 
        logo={{
          href: '/',
          imageSrc: '../assets/logo_chat.png',
          alt: 'Logo'
        }}
        onSearch={handleSearch2}
      />
      <div className="advancedSearch">
        <Link to="/" className="backLink">← Retour</Link>
        
        <h1 className="title">Recherche Avancée</h1>
      
      <form onSubmit={handleSearch} className="searchForm">
        <input 
          placeholder="Titre" 
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})} 
          className="searchInput"
        />
        <input 
          placeholder="Auteur" 
          value={form.author}
          onChange={e => setForm({...form, author: e.target.value})} 
          className="searchInput"
        />
        <input 
          placeholder="Sujet (ex: Fantasy)" 
          value={form.subject}
          onChange={e => setForm({...form, subject: e.target.value})} 
          className="searchInput"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="searchButton"
        >
          {loading ? 'Recherche en cours...' : 'Rechercher'}
        </button>
      </form>

      {/* Grille de résultats */}
      <div className="resultsGrid">
        {results.map((book, i) => {
          // On extrait l'ID (ex: OL27448W) depuis la clé "/works/ID"
          const bookId = book.key.split('/').pop();

          return (
            <Link to={`/book/${bookId}`} key={i} style={{ textDecoration: 'none' }}>
              <Card
                name={book.title}
                author={book.author_name ? book.author_name[0] : 'Auteur inconnu'}
                bookCover={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : undefined}
                period={book.first_publish_year ? `${book.first_publish_year}` : undefined}
              />
            </Link>
          );
        })}
      </div>

        {!loading && results.length === 0 && form.title && (
          <p className="noResults">Aucun livre trouvé pour cette recherche.</p>
        )}
      </div>
      <Footer 
        number="0895 234 069"
        adress="40 Rue du Dr Roux, 75015 Paris"
        logoInsta="https://www.instagram.com/supinfo/"
        LogoX="https://www.youtube.com/watch?v=bbZ837Wjj1k&list=RDbbZ837Wjj1k&start_radio=1"
      />
    </>
  );
}

export default AdvancedSearch;