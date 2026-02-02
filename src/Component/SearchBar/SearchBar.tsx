import type { SearchBarProps } from "./SearchBarProps";
import './searchbar.scss';

const SearchBar: React.FC<SearchBarProps> = ({ value, placeholder, onChange, onSearch }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(value || "");
    }
  };

  const handleSearch = () => {
    onSearch(value || "");
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder={placeholder || "Chercher un livre..."}
        value={value || ""}
        onChange={handleInputChange}
        onKeyUp ={handleKeyPress}
      />
      <button onClick={handleSearch}>🔍</button>
    </div>
  );
};

export default SearchBar;




/*UTILISATION EXEMPLE
const [searchQuery, setSearchQuery] = useState("");

const handleSearch = (query: string) => {
  console.log("Recherche :", query);
  // Appeler l'API pour chercher les livres
};

<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}           // À chaque lettre
  onSearch={handleSearch}              // Enter ou clic bouton
  placeholder="Chercher un livre..."
/>*/