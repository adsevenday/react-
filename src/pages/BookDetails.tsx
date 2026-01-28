import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OpenLibraryService } from '../api/openLibrary';

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [wikiData, setWikiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const bookData = await OpenLibraryService.getBookDetails(id);
        setBook(bookData);

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

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', color: 'white', fontSize: '1.5rem' }}>Chargement...</div>;
  if (!book) return <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>Livre non trouvé.</div>;

  return (
    <div style={{ 
      padding: '40px', 
      width: '100%', 
      minHeight: '100vh',
      boxSizing: 'border-box', 
      color: 'white', 
      backgroundColor: '#121212',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center' // Centre tout le contenu verticalement
    }}>
      {/* Conteneur pour le bouton retour aligné à gauche du bloc central */}
      <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#4facfe', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
          ← Retour à la librairie
        </Link>
      </div>
      
      {/* Bloc principal centré */}
      <div style={{ 
        display: 'flex', 
        gap: '60px', 
        width: '100%',
        maxWidth: '1200px', // Limite la largeur pour garder le contenu centré et lisible
        flexWrap: 'wrap', 
        justifyContent: 'center', // Centre les colonnes image et texte
        alignItems: 'flex-start'
      }}>
        
        {/* Colonne Couverture */}
        <div style={{ flex: '1', minWidth: '400px', maxWidth: '500px' }}>
          {book.covers ? (
            <img 
              src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`} 
              alt={book.title} 
              style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}
            />
          ) : (
            <div style={{ height: '600px', background: '#333', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Aucune image
            </div>
          )}
        </div>

        {/* Colonne Informations */}
        <div style={{ flex: '1.2', minWidth: '400px', textAlign: 'left' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '10px', lineHeight: '1.1' }}>{book.title}</h1>
          
          <div style={{ marginBottom: '30px' }}>
            <span style={{ background: '#4facfe', padding: '8px 15px', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold' }}>
              Réf : {id}
            </span>
          </div>

          <h3 style={{ fontSize: '1.8rem', color: '#4facfe', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
            Description
          </h3>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.7', color: '#ddd', marginTop: '20px' }}>
            {/* Gestion sécurisée de la description */}
            {typeof book.description === 'string' 
              ? book.description 
              : (book.description?.value || "Pas de description disponible.")}
          </p>

          {/* Section Wikipedia */}
          {wikiData && (
            <div style={{ 
              marginTop: '50px', 
              padding: '30px', 
              backgroundColor: '#1a1a1a', 
              borderRadius: '15px', 
              borderLeft: '8px solid #4facfe' 
            }}>
              <h3 style={{ marginTop: 0, fontSize: '1.5rem' }}>Zoom Wikipedia</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#ccc' }}>{wikiData.extract}</p>
              <a 
                href={wikiData.content_urls?.desktop?.page} 
                target="_blank" 
                rel="noreferrer"
                style={{ color: '#4facfe', fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                Lire la suite sur Wikipedia →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;