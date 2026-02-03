import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { OpenLibraryService } from '../api/openLibrary';
import NavHeader from '../Component/NavHeader/NavHeader';
import Footer from '../Component/Footer/Footer';
import Card from '../Component/Card/Card';
import './home.scss';

function Home() {
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      setLoading(true);
      try {
        const changes = await OpenLibraryService.getRecentChanges(100); 
        
        if (!changes || !Array.isArray(changes)) {
          setRecentBooks([]);
          return;
        }

        const workIds = [...new Set(changes
          .filter((c: any) => c?.changes && c.changes[0])
          .map((c: any) => c.changes[0].key)
          .filter((key: string) => key && key.startsWith('/works/'))
          .map((key: string) => key.split('/').pop())
        )].slice(0, 20); 

        const detailedBooks = await Promise.all(
          workIds.map(async (id): Promise<any> => {
            try {
              return await OpenLibraryService.getBookDetails(id as string);
            } catch (err) {
              return null;
            }
          })
        );
        
        // Correction de l'erreur TypeScript (trait rouge) :
        const validBooks = detailedBooks.filter((book: any) => book !== null && book.title);
        setRecentBooks(validBooks);

      } catch (error) {
        console.error("Erreur Home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const handleNavSearch = async (query: string) => {
    if (!query.trim()) {
      setHasSearched(false);
      return;
    }
    setLoading(true);
    try {
      const data = await OpenLibraryService.advancedSearch({ title: query });
      setSearchResults(data.docs || []);
      setHasSearched(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavHeader 
        logo={{ href: '/', imageSrc: '/logo_chat.png', alt: 'Logo' }}
        onSearch={handleNavSearch}
      />

      <div className="homeContainer">
        {loading ? (
          <div className="loadingContainer">Synchronisation avec la bibliothèque...</div>
        ) : (
          <>
            {hasSearched ? (
              <section className="section">
                <h2 className="sectionTitle">Résultats de recherche</h2>
                <div className="booksGrid">
                  {searchResults.map((book, i) => (
                    <Link to={`/book/${book.key?.split('/').pop()}`} key={i} style={{ textDecoration: 'none' }}>
                      <Card 
                        name={book.title} 
                        author={book.author_name?.[0] || 'Auteur inconnu'} 
                        bookCover={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : undefined} 
                      />
                    </Link>
                  ))}
                </div>
                {searchResults.length === 0 && <p className="noResults">Aucun résultat trouvé.</p>}
              </section>
            ) : (
              <section className="section">
                <div className="sectionHeader">
                  <div className="headerBar" style={{backgroundColor: '#fb6f92'}}></div>
                  <h2 className="sectionTitle">Derniers livres ajoutés</h2>
                </div>
                
                <div className="booksGrid">
                  {recentBooks.map((book, i) => (
                    <Link to={`/book/${book.key?.split('/').pop()}`} key={i} style={{ textDecoration: 'none' }}>
                      <Card 
                        name={book.title} 
                        author="Nouveauté" 
                        bookCover={book.covers ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg` : undefined} 
                      />
                    </Link>
                  ))}
                </div>
              </section>
            )}
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

export default Home;