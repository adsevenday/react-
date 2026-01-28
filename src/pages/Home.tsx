import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OpenLibraryService } from '../api/openLibrary';

function Home() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Récupération de 12 nouveautés pour remplir l'espace (sujet 'love')
        const data = await OpenLibraryService.getBooksBySubject('love');
        setTrendingBooks(data.works || []);
      } catch (error) {
        console.error("Erreur lors du chargement des nouveautés :", error);
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
      setBooks(data.docs || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      width: '100%', 
      minHeight: '100vh',
      boxSizing: 'border-box', 
      color: 'white',
      backgroundColor: '#121212',
      margin: 0
    }}>
      {/* HEADER GÉANT (X2) : TITRE & LOGO À GAUCHE, RECHERCHE À DROITE */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '100px', 
        padding: '30px 40px',
        borderBottom: '2px solid #333'
      }}>
        {/* BLOC LOGO + TITRE (GAUCHE) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <img 
            src="/logo_chat.png" 
            alt="Logo Chat" 
            style={{ 
              width: '130px', 
              height: '130px', 
              borderRadius: '20px',
              filter: 'drop-shadow(0 0 20px #4facfe)' 
            }} 
          />
          <h1 style={{ fontSize: '6rem', margin: 0, fontWeight: '900', letterSpacing: '-3px' }}> 
            Joséphine librairie 
          </h1>
        </div>

        {/* BLOC RECHERCHE GÉANT (DROITE) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '20px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '20px' }}>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              style={{ 
                padding: '25px 40px', 
                width: '600px', 
                borderRadius: '60px', 
                border: '2px solid #444', 
                background: '#222', 
                color: 'white',
                fontSize: '2.2rem', 
                outline: 'none',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
              }}
            />
            <button type="submit" style={{ 
              padding: '20px 50px', 
              background: '#4facfe', 
              color: 'white', 
              border: 'none', 
              borderRadius: '60px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '1.8rem',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? '...' : 'Chercher'}
            </button>
          </form>
          <Link to="/advanced" style={{ color: '#4facfe', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', marginRight: '30px' }}>
            🔍 Recherche avancée
          </Link>
        </div>
      </header>

      {/* SECTION NOUVEAUTÉS (4 PAR LIGNE) */}
      {books.length === 0 && !loading && (
        <section style={{ padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '50px' }}>
            <div style={{ width: '10px', height: '60px', background: '#4facfe', marginRight: '25px' }}></div>
            <h2 style={{ fontSize: '3rem', margin: 0, fontWeight: 'bold' }}>Les nouveaux arrivants</h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '50px'
          }}>
            {trendingBooks.map((book, index) => {
              const bookId = book.key.split('/').pop();
              return (
                <Link to={`/book/${bookId}`} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ 
                    textAlign: 'center', 
                    background: '#1a1a1a',
                    padding: '25px',
                    borderRadius: '30px',
                    transition: 'transform 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {book.cover_id ? (
                      <img 
                        src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`} 
                        alt={book.title} 
                        style={{ 
                          width: '100%', 
                          borderRadius: '20px', 
                          boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                          aspectRatio: '2/3',
                          objectFit: 'cover'
                        }} 
                      />
                    ) : (
                      <div style={{ aspectRatio: '2/3', background: '#333', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        Image non disponible
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.6rem', marginTop: '25px', fontWeight: '700' }}>{book.title}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION RÉSULTATS DE RECHERCHE */}
      {books.length > 0 && (
        <section style={{ padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '50px' }}>
            <div style={{ width: '10px', height: '60px', background: '#4facfe', marginRight: '25px' }}></div>
            <h2 style={{ fontSize: '3rem', margin: 0, fontWeight: 'bold' }}>Résultats de recherche</h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '50px'
          }}>
            {books.map((book, index) => {
              const bookId = book.key.split('/').pop();
              return (
                <Link to={`/book/${bookId}`} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ 
                    textAlign: 'center', 
                    background: '#1a1a1a',
                    padding: '25px',
                    borderRadius: '30px',
                    border: '1px solid #333'
                  }}>
                    {book.cover_i ? (
                      <img 
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} 
                        alt={book.title} 
                        style={{ 
                          width: '100%', 
                          borderRadius: '20px', 
                          boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                          aspectRatio: '2/3',
                          objectFit: 'cover'
                        }} 
                      />
                    ) : (
                      <div style={{ aspectRatio: '2/3', background: '#333', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Pas d'image
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.6rem', marginTop: '25px', fontWeight: '700' }}>{book.title}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;