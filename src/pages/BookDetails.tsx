import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OpenLibraryService } from '../api/openLibrary';

function BookDetails() {
  const { id } = useParams(); // Récupère l'ID depuis l'URL (ex: OL27448W)
  const [book, setBook] = useState<any>(null);
  const [wikiData, setWikiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 1. Récupérer les détails sur Open Library
        const bookData = await OpenLibraryService.getBookDetails(id);
        setBook(bookData);

        // 2. Chercher sur Wikipedia avec le titre du livre
        if (bookData.title) {
          const wiki = await OpenLibraryService.getWikipediaSummary(bookData.title);
          setWikiData(wiki);
        }
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: 'white' }}>Chargement des détails...</div>;
  if (!book) return <div style={{ padding: '50px', textAlign: 'center', color: 'white' }}>Livre non trouvé.</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', color: 'white' }}>
      <Link to="/" style={{ color: '#4facfe', textDecoration: 'none' }}>← Retour à la recherche</Link>
      
      <div style={{ display: 'flex', gap: '40px', marginTop: '30px', flexWrap: 'wrap' }}>
        {/* Couverture à gauche */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          {book.covers ? (
            <img 
              src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`} 
              alt={book.title} 
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            />
          ) : (
            <div style={{ height: '400px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Aucune image</div>
          )}
        </div>

        {/* Infos à droite */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{book.title}</h1>
          
          <div style={{ marginBottom: '20px' }}>
            <span style={{ background: '#4facfe', padding: '5px 10px', borderRadius: '4px', fontSize: '0.9rem' }}>
              ID: {id}
            </span>
          </div>

          <h3>Description (Open Library)</h3>
          <p style={{ lineHeight: '1.6', color: '#ccc' }}>
            {typeof book.description === 'string' 
              ? book.description 
              : (book.description?.value || "Pas de description disponible sur Open Library.")}
          </p>

          {/* Section WIKIPEDIA (Validation des 2pts) */}
          {wikiData && (
            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#252525', borderRadius: '10px', borderLeft: '5px solid #4facfe' }}>
              <h3 style={{ marginTop: 0 }}>📚 Complément Wikipedia</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{wikiData.extract}</p>
              <a 
                href={wikiData.content_urls?.desktop?.page} 
                target="_blank" 
                rel="noreferrer"
                style={{ color: '#4facfe', fontWeight: 'bold' }}
              >
                Lire l'article complet sur Wikipedia →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;