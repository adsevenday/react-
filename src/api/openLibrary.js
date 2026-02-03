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
  // `filters` peut être un objet (ex: { title: 'x' }) ou une chaîne de requête brute (ex: 'q=first_publish_year:1999')
  advancedSearch: async (filters) => {
    let queryString = '';
    if (typeof filters === 'string') {
      queryString = filters;
    } else {
      queryString = new URLSearchParams(filters).toString();
    }
    const sep = queryString ? `?${queryString}&limit=15` : `?limit=15`;
    const response = await fetch(`${BASE_URL}/search.json${sep}`);
    if (!response.ok) throw new Error("Erreur recherche avancée");
    return await response.json();
  },

  // recupération de Wikipedia 
  getWikipediaSummary: async (title) => {
    
    const formattedTitle = encodeURIComponent(title.replace(/ /g, '_'));
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${formattedTitle}`);
    if (!response.ok) return null; 
    return await response.json();
  },

  // Récupération de l'année de publication via les éditions
  getPublishYear: async (workId) => {
    try {
      const response = await fetch(`${BASE_URL}/works/${workId}/editions.json?limit=1`);
      if (!response.ok) return null;
      const data = await response.json();
      if (data.entries && data.entries.length > 0) {
        return data.entries[0].publish_date ? new Date(data.entries[0].publish_date).getFullYear() : null;
      }
      return null;
    } catch (error) {
      console.error("Erreur récupération année:", error);
      return null;
    }
  },
};