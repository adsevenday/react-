import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import AdvancedSearch from './pages/AdvancedSearch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/advanced" element={<AdvancedSearch />} />
      </Routes>
    </Router>
  );
}

export default App;