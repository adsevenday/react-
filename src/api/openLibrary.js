const BASE_URL = "https://openlibrary.org";

export const OpenLibraryService = {
  // 1. Recherche rapide (utilisée par la barre de recherche principale)
  searchBooks: async (query) => {
    const response = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=10`);
    if (!response.ok) throw new Error("Erreur réseau");
    return await response.json();
  },

// Dans src/api/openLibrary.js
  getBooksBySubject: async (subject = 'love') => {
  // Changement de limit=5 à limit=12
    const response = await fetch(`${BASE_URL}/subjects/${encodeURIComponent(subject)}.json?limit=12`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des livres par sujet");
    return await response.json();
  },

  // 3. Détails d'un livre (utilisé par BookDetails.tsx)
  getBookDetails: async (workId) => {
    const response = await fetch(`${BASE_URL}/works/${workId}.json`);
    if (!response.ok) throw new Error("Livre introuvable");
    return await response.json();
  },

  // 4. Recherche avancée (utilisée par AdvancedSearch.tsx)
  advancedSearch: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${BASE_URL}/search.json?${params}&limit=15`);
    if (!response.ok) throw new Error("Erreur recherche avancée");
    return await response.json();
  },

  // 5. Wikipedia (utilisé pour le résumé sur la page détails)
  getWikipediaSummary: async (title) => {
    // On remplace les espaces par des underscores pour l'URL Wikipedia
    const formattedTitle = encodeURIComponent(title.replace(/ /g, '_'));
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${formattedTitle}`);
    if (!response.ok) return null; 
    return await response.json();
  }
};