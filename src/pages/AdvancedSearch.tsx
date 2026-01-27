import { useState } from 'react';
import { OpenLibraryService } from '../api/openLibrary';
import { Link } from 'react-router-dom';

function AdvancedSearch() {
  const [form, setForm] = useState({ title: '', author: '', subject: '' });
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // On retire les champs vides
    const activeFilters = Object.fromEntries(Object.entries(form).filter(([_, v]) => v !== ''));
    const data = await OpenLibraryService.advancedSearch(activeFilters);
    setResults(data.docs);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#4facfe' }}>← Retour</Link>
      <h1>🔍 Recherche Avancée</h1>
      
      <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input placeholder="Titre" onChange={e => setForm({...form, title: e.target.value})} style={{padding: '10px'}} />
        <input placeholder="Auteur" onChange={e => setForm({...form, author: e.target.value})} style={{padding: '10px'}} />
        <input placeholder="Sujet (ex: Fantasy)" onChange={e => setForm({...form, subject: e.target.value})} style={{padding: '10px'}} />
        <button type="submit" style={{padding: '10px', background: '#4facfe', color: 'white', border: 'none'}}>Rechercher</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        {results.map((book, i) => (
          <p key={i}>• {book.title} ({book.author_name?.[0]})</p>
        ))}
      </div>
    </div>
  );
}

export default AdvancedSearch;