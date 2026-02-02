import { useState } from 'react';
import { OpenLibraryService } from '../api/openLibrary';
import { Link } from 'react-router-dom';
import Card from '../Component/Card/Card';
import NavHeader from '../Component/NavHeader/NavHeader';
import Footer from '../Component/Footer/Footer';
import './advancedSearch.scss';

function AdvancedSearch() {
  const [form, setForm] = useState({ title: '', author: '', subject: '' });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // On retire les champs vides pour ne pas polluer l'API
      const activeFilters = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '')
      );
      const data = await OpenLibraryService.advancedSearch(activeFilters);
      setResults(data.docs || []);
    } catch (error) {
      console.error("Erreur recherche avancée:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch2 = (query: string) => {
    setForm({...form, title: query});
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
        number="+33 1 23 45 67 89"
        adress="123 Rue de la Littérature, Paris"
        logoInsta="https://instagram.com"
        LogoX="https://x.com"
      />
    </>
  );
}

export default AdvancedSearch;