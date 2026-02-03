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
  const [publishYear, setPublishYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const bookData = await OpenLibraryService.getBookDetails(id);
        setBook(bookData);

        if (bookData.authors && bookData.authors.length > 0) {
          try {
            const names = await Promise.all(bookData.authors.map(async (a: any) => {
              if (!a) return null;
              if (typeof a === 'string') return a;
              if (a.name) return a.name;
              const authorKey = a.author?.key || a.key || (a['author'] && a['author']['key']);
              if (authorKey) {
                try {
                  const resp = await fetch(`https://openlibrary.org${authorKey}.json`);
                  if (resp.ok) {
                    const authorData = await resp.json();
                    return authorData.name || null;
                  }
                } catch (e) {
                  console.error('Erreur récupération author detail', e);
                  return null;
                }
              }
              return null;
            }));

            const filtered = names.filter((n: any) => n);
            if (filtered.length > 0) {
              bookData.authors = filtered.map((n: string) => ({ name: n }));
              setBook({ ...bookData });
            }
          } catch (e) {
            console.error('Erreur lors de la résolution des auteurs du work', e);
          }
        }

        if (!bookData.authors || bookData.authors.length === 0) {
          try {
            const searchData = await OpenLibraryService.advancedSearch({ title: bookData.title });
            if (searchData.docs && searchData.docs.length > 0) {
              for (let i = 0; i < searchData.docs.length; i++) {
                const doc = searchData.docs[i];
                if (doc.author_name && doc.author_name.length > 0) {
                  bookData.authors = doc.author_name.map((name: string) => ({ name }));
                  setBook({ ...bookData });
                  break;
                }
              }
            }
          } catch (e) {
            console.error('Erreur advancedSearch fallback', e);
          }
        }

        const year = await OpenLibraryService.getPublishYear(id);
        setPublishYear(year);

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

              <div className="bookInfoColumn">
                <h1 className="bookTitle">{book.title}</h1>
                
                <div className="refBadge">
                  Réf : {id}
                </div>

                {book.authors && book.authors.length > 0 && (
                  <div className="bookMeta">
                    <p className="metaItem">
                      <strong>Auteur(s) :</strong> {book.authors.map((a: any) => {
                        if (typeof a === 'string') return a;
                        return a.name || 'Auteur inconnu';
                      }).join(", ")}
                    </p>
                  </div>
                )}

                {(!book.authors || book.authors.length === 0) && (
                  <div className="bookMeta">
                    <p className="metaItem">
                      <strong>Auteur(s) :</strong> Non disponible
                    </p>
                  </div>
                )}

                {book.subjects && book.subjects.length > 0 && (
                  <div className="bookMeta">
                    <p className="metaItem">
                      <strong>Sujet(s) :</strong> {book.subjects.slice(0, 5).join(", ")}
                    </p>
                  </div>
                )}

                <h3 className="sectionTitle">Description</h3>
                <p className="bookDescription">
                  {typeof book.description === 'string' 
                    ? book.description 
                    : (book.description?.value || "Pas de description disponible.")}
                </p>

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