const BASE_URL = "https://openlibrary.org";

export const OpenLibraryService = {
  // 1. Recherche rapide (Search API)
  searchBooks: async (query) => {
    const response = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=10`);
    if (!response.ok) throw new Error("Erreur réseau");
    return await response.json();
  },

  // 2. Dernières modifications (RecentChanges API) pour la page d'accueil
  getRecentChanges: async () => {
    const response = await fetch(`${BASE_URL}/recentchanges.json?limit=5`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des changements");
    return await response.json();
  },

  // 3. Détails d'un livre (NÉCESSAIRE pour BookDetails.tsx)
  getBookDetails: async (workId) => {
    const response = await fetch(`${BASE_URL}/works/${workId}.json`);
    if (!response.ok) throw new Error("Livre introuvable");
    return await response.json();
  },

  // 4. Recherche avancée
  advancedSearch: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${BASE_URL}/search.json?${params}&limit=15`);
    if (!response.ok) throw new Error("Erreur recherche avancée");
    return await response.json();
  },

  // 5. Wikipedia
  getWikipediaSummary: async (title) => {
    // On remplace les espaces par des underscores pour l'URL Wikipedia
    const formattedTitle = encodeURIComponent(title.replace(/ /g, '_'));
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${formattedTitle}`);
    if (!response.ok) return null; // Wikipedia n'a peut-être pas d'article correspondant
    return await response.json();
  }
};