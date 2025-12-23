import { Song } from "@/types/music";

// Found a working instance via Vercel (Thanks to the open source community)
const BASE_URL = "https://jiosaavn-api-sigma-sandy.vercel.app";

// Helper to decode HTML entities
// Helper to decode HTML entities
const decodeHtmlEntities = (str: string) => {
  if (!str) return "";
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#34;/g, '"')  // Another code for quote
    .replace(/&#38;/g, '&')  // Another code for ampersand
    .replace(/&#39;/g, "'"); // Another code for apostrophe
};

// Helper to map API response to our internal Song interface
const mapSongFromApi = (item: any): Song => {
    // API returns image as an array of objects { quality, link } or just an array of strings depending on the endpoint version
    // The "sigma-sandy" instance usually follows the v4 structure:
    // image: [ { quality: "50x50", link: "..." }, ... ]
    
    let coverUrl = "";
    if (Array.isArray(item.image)) {
        // Try to get the highest quality (usually last item)
        const lastImage = item.image[item.image.length - 1];
        coverUrl = typeof lastImage === 'string' ? lastImage : lastImage?.link || "";
    } else {
        coverUrl = item.image || "";
    }

    let audioUrl = "";
    if (Array.isArray(item.downloadUrl)) {
        // Try to get 320kbps or highest available
        const lastUrl = item.downloadUrl[item.downloadUrl.length - 1];
        audioUrl = typeof lastUrl === 'string' ? lastUrl : lastUrl?.link || "";
    } else {
        audioUrl = item.downloadUrl || "";
    }

  return {
    id: item.id,
    title: decodeHtmlEntities(item.name || item.title || "Unknown Title"),
    artist: decodeHtmlEntities(item.primaryArtists || item.artist || item.subtitle || "Unknown Artist"),
    album: decodeHtmlEntities(item.album?.name || item.album || "Unknown Album"),
    coverUrl: coverUrl,
    audioUrl: audioUrl,
    duration: parseInt(item.duration) || 0,
  };
};

export const api = {
  searchSongs: async (query: string): Promise<Song[]> => {
    try {
      const res = await fetch(`${BASE_URL}/search/songs?query=${encodeURIComponent(query)}&limit=10`);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      
      // Check for data.data.results (common structure) or data.results or just data
      const results = data.data?.results || data.results || data.data || [];
      
      if (!Array.isArray(results)) return [];
      return results.map(mapSongFromApi);
    } catch (error) {
      console.error("Search API Error:", error);
      return [];
    }
  },

  getTrending: async (): Promise<Song[]> => {
    try {
      // Searching for "Latest Hindi" to simulate trending/fresh content
      const res = await fetch(`${BASE_URL}/search/songs?query=latest%20hindi&limit=80`);
      if (!res.ok) throw new Error("Failed to fetch trending");
      const data = await res.json();
      
      const results = data.data?.results || data.results || data.data || [];
      if (!Array.isArray(results)) return [];
      return results.map(mapSongFromApi);
    } catch (error) {
       console.error("Trending API Error:", error);
       // Fallback mock data to prevent crash if API is flaky
       return [
          {
              id: "mock1",
              title: "API Unavailable - Mock Song",
              artist: "System",
              album: "Error Handling",
              coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
              audioUrl: "",
              duration: 0
          }
       ];
    }
  },
  
  getSongById: async (id: string): Promise<Song | null> => {
     try {
      const res = await fetch(`${BASE_URL}/songs?id=${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      const songData = data.data?.[0] || data.data || data[0]; 
      if (!songData) return null;
      return mapSongFromApi(songData);
    } catch (error) {
      console.error("Song Details API Error:", error);
      return null;
    }
  }
};
