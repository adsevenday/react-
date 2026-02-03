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
    try {
      const response = await fetch(`${BASE_URL}/works/${workId}.json`);
      if (!response.ok) throw new Error("Livre introuvable");
      const data = await response.json();
      
      // Récupérer les éditions pour avoir plus d'informations
      try {
        const editionsResponse = await fetch(`${BASE_URL}/works/${workId}/editions.json?limit=3`);
        if (editionsResponse.ok) {
          const editionsData = await editionsResponse.json();
          if (editionsData.entries && editionsData.entries.length > 0) {
            const firstEdition = editionsData.entries[0];
            
            // Récupérer d'autres infos utiles des éditions
            if (!data.description && firstEdition.description) {
              data.description = firstEdition.description;
            }
          }
        }
      } catch (error) {
        console.error("Erreur récupération éditions:", error);
      }
      
      return data;
    } catch (error) {
      console.error("Erreur getBookDetails:", error);
      throw error;
    }
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