import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OpenLibraryService } from '../api/openLibrary';
import NavHeader from '../Component/NavHeader/NavHeader';
import Footer from '../Component/Footer/Footer';
import Card from '../Component/Card/Card';
import './home.scss';

function Home() {
  const [trendingBooks, setTrendingBooks] = useState<any[]>([]);
  const navigate = useNavigate();

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

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/advanced?title=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <NavHeader 
        logo={{
          href: '/', 
          imageSrc: '../assets/logo_chat.png',
          alt: 'Logo Joséphine Librairie'
        }}
        onSearch={handleSearch}
      />

      <div className="homeContainer">
        <section className="section">
          <div className="sectionHeader">
            <div className="headerBar"></div>
            <h2 className="sectionTitle">Les nouveaux arrivants</h2>
          </div>

          <div className="booksGrid">
            {trendingBooks.map((book, index) => {
              const bookId = book.key.split('/').pop();
              return (
                <Link to={`/book/${bookId}`} key={index} style={{ textDecoration: 'none' }}>
                  <Card
                    name={book.title}
                    author={book.author_name ? book.author_name[0] : 'Auteur inconnu'}
                    bookCover={book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : undefined}
                  />
                </Link>
              );
            })}
          </div>
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