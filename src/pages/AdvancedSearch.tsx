import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// @ts-ignore
import { OpenLibraryService } from '../api/openLibrary';
import { Link } from 'react-router-dom';
import Card from '../Component/Card/Card';
import NavHeader from '../Component/NavHeader/NavHeader';
import Footer from '../Component/Footer/Footer';
import './advancedSearch.scss';

function AdvancedSearch() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ title: '', author: '', subject: '', year: '' });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const title = searchParams.get('title');
    if (title) {
      setForm({ title, author: '', subject: '', year: '' });
      performSearch({ title, author: '', subject: '', year: '' });
    }
  }, [searchParams]);

  const performSearch = async (searchForm: typeof form) => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(searchForm)
          .filter(([_, v]) => v !== '')
          // map our local `year` key to the OpenLibrary `first_publish_year` param
          .map(([k, v]) => (k === 'year' ? ['first_publish_year', v] : [k, v]))
      );

      // Si aucun filtre actif, ne pas appeler l'API
      const keys = Object.keys(activeFilters);
      if (keys.length === 0) {
        setResults([]);
        return;
      }

      // Construire une requête `q` combinant tous les champs pour forcer un AND logique
      const qParts = Object.entries(activeFilters).map(([k, v]) => {
        const val = String(v).replace(/"/g, '\\"');
        if (k === 'title' || k === 'author' || k === 'subject') {
          return `${k}:"${val}"`;
        }
        // first_publish_year et autres champs numériques
        return `${k}:${val}`;
      });

      const qString = qParts.join(' ');
      const data = await OpenLibraryService.advancedSearch(`q=${encodeURIComponent(qString)}`);
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
          imageSrc: '/logo_chat.png',
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
        <input
          placeholder="Année (ex: 1999)"
          value={form.year}
          onChange={e => setForm({...form, year: e.target.value})}
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

        {!loading && results.length === 0 && (form.title || form.author || form.subject || form.year) && (
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