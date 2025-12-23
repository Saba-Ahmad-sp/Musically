export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  audioUrl: string; // URL to the mp3/stream
  duration: number; // in seconds
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

// Define the Player State structure for Zustand
export interface PlayerState {
  isPlaying: boolean;
  currentSong: Song | null;
  volume: number; // 0-1
  currentTime: number;
  duration: number;
  isFullPlayerOpen: boolean;
  isShuffle: boolean;
  repeatMode: 'none' | 'all' | 'one';
  queue: Song[];
  likedSongs: Song[];
  activeTab: string;
  searchQuery: string;
  searchResults: Song[];
  trendingSongs: Song[];
  isSearching: boolean;
  
  // Actions
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setSong: (song: Song) => void;
  setQueue: (songs: Song[]) => void;
  toggleLike: (song: Song) => void;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (songs: Song[]) => void;
  setTrendingSongs: (songs: Song[]) => void;
  setIsSearching: (isSearching: boolean) => void;
  next: () => void;
  prev: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setFullPlayerOpen: (isOpen: boolean) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}
