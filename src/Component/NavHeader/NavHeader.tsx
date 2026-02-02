import type { NavHeaderProps } from './NavHearder';
import { useState } from 'react';
import Logo from '../Logo/Logo.tsx';
import SearchBar from '../SearchBar/SearchBar.tsx';

const NavHeader: React.FC<NavHeaderProps> = ({ logo, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <nav className="navheader">
      <Logo {...logo} />
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        placeholder="Chercher un livre..."
      />
    </nav>
  );
};

export default NavHeader;




/*UTILISATION EXEMPLE

const handleSearch = (query: string) => {
/ Faire une requête API pour chercher des livres
  };
      <NavHeader 
        logo={{
          imageSrc: "/assets/logo.png",
          href: "/"
        }}
        onSearch={handleSearch}
      /> */