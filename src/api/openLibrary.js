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
    if (!response.ok) throw new Error("Erreur lors de la récupération des changements"); // Ajoute cette ligne
return await response.json();
  }
};

// Ajoute ceci dans OpenLibraryService dans openLibrary.js
getWikipediaSummary: async (title) => {
  const formattedTitle = encodeURIComponent(title.replace(/ /g, '_'));
  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${formattedTitle}`);
  if (!response.ok) return null; // Wikipedia n'a peut-être pas le livre
  return await response.json();
}

// Ajoute cette fonction dans l'objet OpenLibraryService dans openLibrary.js
advancedSearch: async (filters) => {
  // filters sera un objet comme { author: "Tolkien", title: "Hobbit" }
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`${BASE_URL}/search.json?${params}&limit=15`);
  if (!response.ok) throw new Error("Erreur recherche avancée");
  return await response.json();
},