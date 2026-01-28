import { useState } from 'react';
import { OpenLibraryService } from '../api/openLibrary';
import { Link } from 'react-router-dom';

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

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
      <Link to="/" style={{ color: '#4facfe', textDecoration: 'none' }}>← Retour</Link>
      
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}> Recherche Avancée</h1>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
        <input 
          placeholder="Titre" 
          onChange={e => setForm({...form, title: e.target.value})} 
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: 'white' }} 
        />
        <input 
          placeholder="Auteur" 
          onChange={e => setForm({...form, author: e.target.value})} 
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: 'white' }} 
        />
        <input 
          placeholder="Sujet (ex: Fantasy)" 
          onChange={e => setForm({...form, subject: e.target.value})} 
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: 'white' }} 
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px', background: '#4facfe', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Recherche en cours...' : 'Rechercher'}
        </button>
      </form>

      {/* Grille de résultats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
        gap: '20px' 
      }}>
        {results.map((book, i) => {
          // On extrait l'ID (ex: OL27448W) depuis la clé "/works/ID"
          const bookId = book.key.split('/').pop();

          return (
            <Link to={`/book/${bookId}`} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                border: '1px solid #333', 
                padding: '15px', 
                borderRadius: '10px', 
                textAlign: 'center',
                backgroundColor: '#1a1a1a',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {/* Affichage de l'image de couverture */}
                {book.cover_i ? (
                  <img 
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} 
                    alt={book.title} 
                    style={{ width: '100%', borderRadius: '5px', marginBottom: '10px' }} 
                  />
                ) : (
                  <div style={{ height: '220px', background: '#333', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    Pas d'image
                  </div>
                )}
                
                <h3 style={{ fontSize: '14px', margin: '5px 0' }}>{book.title}</h3>
                {book.author_name && (
                  <p style={{ fontSize: '12px', color: '#aaa' }}>{book.author_name[0]}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {!loading && results.length === 0 && form.title && (
        <p style={{ textAlign: 'center', color: '#666' }}>Aucun livre trouvé pour cette recherche.</p>
      )}
    </div>
  );
}

export default AdvancedSearch;