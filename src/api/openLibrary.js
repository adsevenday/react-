const BASE_URL = "https://openlibrary.org";

export const OpenLibraryService = {
  //  Recherche rapide 
  searchBooks: async (query) => {
    const response = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=10`);
    if (!response.ok) throw new Error("Erreur réseau");
    return await response.json();
  },

  // récupération des livres 
  getBooksBySubject: async (subject = 'love') => {
    const response = await fetch(`${BASE_URL}/subjects/${encodeURIComponent(subject)}.json?limit=12`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des livres par sujet");
    return await response.json();
  },

  // Détails d'un livre 
  getBookDetails: async (workId) => {
    const response = await fetch(`${BASE_URL}/works/${workId}.json`);
    if (!response.ok) throw new Error("Livre introuvable");
    return await response.json();
  },

  //  Recherche avancée 
  advancedSearch: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${BASE_URL}/search.json?${params}&limit=15`);
    if (!response.ok) throw new Error("Erreur recherche avancée");
    return await response.json();
  },

  // recupération de Wikipedia 
  getWikipediaSummary: async (title) => {
    
    const formattedTitle = encodeURIComponent(title.replace(/ /g, '_'));
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${formattedTitle}`);
    if (!response.ok) return null; 
    return await response.json();
  }
};