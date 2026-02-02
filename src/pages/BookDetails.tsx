import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// @ts-ignore
import { OpenLibraryService } from '../api/openLibrary';
import NavHeader from '../Component/NavHeader/NavHeader';
import Footer from '../Component/Footer/Footer';
import WikiCard from '../Component/WikiCard/WikiCard';
import './bookDetails.scss';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/advanced?title=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <NavHeader 
        logo={{ imageSrc: '/logo_chat.png', alt: 'Logo', href: '/' }} 
        onSearch={handleSearch} 
      />
      
      <div className="bookDetailsContainer">
        {loading && <div className="loadingContainer">Chargement...</div>}
        
        {!loading && !book && <div className="errorContainer">Livre non trouvé.</div>}

        {!loading && book && (
          <>
            <Link to="/" className="backLink">← Retour à la librairie</Link>
            
            <div className="bookDetailsContent">
              
              {/* Colonne Couverture */}
              <div className="bookCoverColumn">
                {book.covers ? (
                  <img 
                    src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`} 
                    alt={book.title} 
                    className="bookCover"
                  />
                ) : (
                  <div className="noCoverImage">Aucune image</div>
                )}
              </div>

              {/* Colonne Informations */}
              <div className="bookInfoColumn">
                <h1 className="bookTitle">{book.title}</h1>
                
                <div className="refBadge">
                  Réf : {id}
                </div>

                <h3 className="sectionTitle">Description</h3>
                <p className="bookDescription">
                  {typeof book.description === 'string' 
                    ? book.description 
                    : (book.description?.value || "Pas de description disponible.")}
                </p>

                {/* Section Wikipedia avec WikiCard */}
                {wikiData && (
                  <div className="wikiSection">
                    <WikiCard 
                      bookCover={wikiData.thumbnail?.source}
                      description={wikiData.extract}
                      link={wikiData.content_urls?.desktop?.page}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
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

export default BookDetails;