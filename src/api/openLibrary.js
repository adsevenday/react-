const BASE_URL = "/api-openlibrary"; 

export const OpenLibraryService = {
  getLatestBooks: async (limit = 12) => {
    try {
      const currentYear = new Date().getFullYear();
      const lastYear = currentYear - 1;
      const query = `first_publish_year:[${lastYear} TO ${currentYear}]`;
      
      const response = await fetch(`${BASE_URL}/search.json?q=${query}&sort=new&limit=${limit}`);
      
      if (!response.ok) {
        const fallbackResponse = await fetch(`${BASE_URL}/search.json?q=the&sort=new&limit=${limit}`);
        if (!fallbackResponse.ok) throw new Error("Erreur lors de la récupération des nouveautés");
        return await fallbackResponse.json();
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur getLatestBooks:", error);
      throw error;
    }
  },

  searchBooks: async (query) => {
    try {
      const response = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=10`);
      if (!response.ok) throw new Error("Erreur réseau");
      return await response.json();
    } catch (error) {
      console.error("Erreur searchBooks:", error);
      throw error;
    }
  },

  getBooksBySubject: async (subject = 'love') => {
    try {
      const response = await fetch(`${BASE_URL}/subjects/${encodeURIComponent(subject)}.json?limit=12`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des livres par sujet");
      return await response.json();
    } catch (error) {
      console.error("Erreur getBooksBySubject:", error);
      throw error;
    }
  },

  getBookDetails: async (workId) => {
    try {
      const response = await fetch(`${BASE_URL}/works/${workId}.json`);
      if (!response.ok) throw new Error("Livre introuvable");
      const data = await response.json();
      
      try {
        const editionsResponse = await fetch(`${BASE_URL}/works/${workId}/editions.json?limit=3`);
        if (editionsResponse.ok) {
          const editionsData = await editionsResponse.json();
          if (editionsData.entries && editionsData.entries.length > 0) {
            const firstEdition = editionsData.entries[0];
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

  advancedSearch: async (filters) => {
    try {
      const queryParts = [];
      
      if (filters.title) queryParts.push(`title:${filters.title}`);
      if (filters.author) queryParts.push(`author:${filters.author}`);
      if (filters.subject) queryParts.push(`subject:${filters.subject}`);
      if (filters.first_publish_year) queryParts.push(`first_publish_year:${filters.first_publish_year}`);

      if (queryParts.length === 0) return { docs: [] };

      const searchQuery = queryParts.join(' ');
      
      const response = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(searchQuery)}&limit=15`);
      
      if (!response.ok) throw new Error("Erreur recherche avancée");
      return await response.json();
    } catch (error) {
      console.error("Erreur advancedSearch:", error);
      throw error;
    }
  },

  getWikipediaSummary: async (title) => {
    try {
      const formattedTitle = encodeURIComponent(title.replace(/ /g, '_'));
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${formattedTitle}`);
      if (!response.ok) return null; 
      return await response.json();
    } catch (error) {
      console.error("Erreur getWikipediaSummary:", error);
      return null;
    }
  },

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