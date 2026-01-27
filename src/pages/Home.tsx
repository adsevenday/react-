import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OpenLibraryService } from '../api/openLibrary';

function Home() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [recentChanges, setRecentChanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const changes = await OpenLibraryService.getRecentChanges();
        setRecentChanges(changes);
      } catch (error) {
        console.error("Erreur home:", error);
      }
    };
    fetchHomeData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const data = await OpenLibraryService.searchBooks(query);
      setBooks(data.docs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1> Joséphine librairie </h1>
        <form onSubmit={handleSearch}>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un livre..."
              style={{ padding: '12px', width: '60%', borderRadius: '5px', border: 'none' }}
            />
            <button type="submit" style={{ padding: '12px 20px', marginLeft: '10px', cursor: 'pointer' }}>
                {loading ? '...' : 'Chercher'}
            </button>
        </form>
        <div style={{ marginTop: '15px' }}>
          <Link to="/advanced" style={{ color: '#4facfe', fontSize: '0.9rem', textDecoration: 'none' }}>
            🔍 Recherche avancée par auteur ou date
          </Link>
        </div>
      </header>

      {books.length === 0 && !loading && (
        <section>
          <h2>🕒 Dernières activités</h2>
          <div style={{ background: '#2a2a2a', padding: '15px', borderRadius: '10px' }}>
            {recentChanges.map((change, index) => (
              <div key={index} style={{ borderBottom: '1px solid #444', padding: '10px 0' }}>
                <strong>Modif:</strong> {change.kind} sur {change.target}
                <br />
                <small style={{ color: '#aaa' }}>{new Date(change.timestamp).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {books.map((book, index) => {
          const bookId = book.key.split('/').pop();
          return (
            <Link to={`/book/${bookId}`} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #333', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                {book.cover_i ? (
                  <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} alt={book.title} style={{ width: '100%', borderRadius: '4px' }} />
                ) : (
                  <div style={{ height: '200px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Pas d'image</div>
                )}
                <h3 style={{ fontSize: '14px', marginTop: '10px' }}>{book.title}</h3>
                <p style={{ fontSize: '12px', color: '#aaa' }}>{book.author_name?.[0]}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Home;