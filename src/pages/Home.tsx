import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import { OpenLibraryService } from '../api/openLibrary';
import NavHeader from '../Component/NavHeader/NavHeader';
import Footer from '../Component/Footer/Footer';
import Card from '../Component/Card/Card';
import './home.scss';

function Home() {
  const [trendingBooks, setTrendingBooks] = useState<any[]>([]);
  const [searchForm, setSearchForm] = useState({ title: '', author: '', subject: '' });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await OpenLibraryService.getBooksBySubject('love');
        setTrendingBooks(data.works || []);
      } catch (error) {
        console.error("Erreur lors du chargement des nouveautés :", error);
      }
    };
    fetchHomeData();
  }, []);

  const performSearch = async (form: typeof searchForm) => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '')
      );
      const data = await OpenLibraryService.advancedSearch(activeFilters);
      setSearchResults(data.docs || []);
      setHasSearched(true);
    } catch (error) {
      console.error("Erreur recherche:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleNavSearch = async (query: string) => {
    const newForm = { title: query, author: '', subject: '' };
    setSearchForm(newForm);
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
          alt: 'Logo Joséphine Librairie'
        }}
        onSearch={handleNavSearch}
      />

      <div className="homeContainer">

        {/* Section des résultats ou nouveaux arrivants */}
        <section className="section">
          <div className="sectionHeader">
            <div className="headerBar"></div>
            <h2 className="sectionTitle">
              {hasSearched ? 'Résultats de recherche' : 'Les nouveaux arrivants'}
            </h2>
          </div>

          <div className="booksGrid">
            {(hasSearched ? searchResults : trendingBooks).map((book, index) => {
              const bookId = book.key.split('/').pop();
              return (
                <Link to={`/book/${bookId}`} key={index} style={{ textDecoration: 'none' }}>
                  <Card
                    name={book.title}
                    author={book.author_name ? book.author_name[0] : 'Auteur inconnu'}
                    bookCover={book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : 
                              book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : undefined}
                    period={book.first_publish_year ? `${book.first_publish_year}` : undefined}
                  />
                </Link>
              );
            })}
          </div>

          {hasSearched && !loading && searchResults.length === 0 && (
            <p className="noResults">Aucun livre trouvé pour cette recherche.</p>
          )}
        </section>
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