import { create } from 'zustand';
import { PlayerState, Song } from '@/types/music';

// Mock Playlist for Next/Prev logic
// In a real app, this would be dynamic or fetched from the Query cache
const MOCK_PLAYLIST: Song[] = [];

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  currentSong: null,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  isFullPlayerOpen: false, // UI State
  isShuffle: false,
  repeatMode: 'none',
  queue: [],
  likedSongs: [],
  activeTab: 'Home',
  searchQuery: '',
  searchResults: [],

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setSong: (song: Song) => set({ currentSong: song, isPlaying: true, currentTime: 0 }),
  setQueue: (songs: Song[]) => set({ queue: songs }),
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSearchResults: (songs: Song[]) => set({ searchResults: songs }),
  toggleLike: (song: Song) => set((state) => {
      const isLiked = state.likedSongs.some(s => s.id === song.id);
      if (isLiked) {
          return { likedSongs: state.likedSongs.filter(s => s.id !== song.id) };
      }
      return { likedSongs: [...state.likedSongs, song] };
  }),
  
  next: () => {
    const { currentSong, queue, repeatMode, isShuffle } = get();
    if (!currentSong || queue.length === 0) return;

    if (repeatMode === 'one') {
        get().setCurrentTime(0);
        get().play();
        return;
    }

    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    let nextIndex = -1;

    if (isShuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
    } else {
        nextIndex = currentIndex + 1;
        if (nextIndex >= queue.length) {
            if (repeatMode === 'all') {
                nextIndex = 0;
            } else {
                return; // End of playlist
            }
        }
    }

    if (nextIndex >= 0 && nextIndex < queue.length) {
        set({ currentSong: queue[nextIndex], isPlaying: true, currentTime: 0 });
    }
  },
  
  prev: () => {
    const { currentSong, queue, currentTime, repeatMode } = get();
    if (!currentSong || queue.length === 0) return;

    if (currentTime > 3) {
        get().setCurrentTime(0);
        return;
    }

    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
        if (repeatMode === 'all') {
             prevIndex = queue.length - 1;
        } else {
            prevIndex = 0; // Or stop? Usually just restart first song
        }
    }

     if (prevIndex >= 0 && prevIndex < queue.length) {
        set({ currentSong: queue[prevIndex], isPlaying: true, currentTime: 0 });
    }
  },

  setVolume: (volume: number) => set({ volume }),
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setDuration: (duration: number) => set({ duration }),
  setFullPlayerOpen: (isOpen: boolean) => set({ isFullPlayerOpen: isOpen }),
  
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  toggleRepeat: () => set((state) => {
      const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
      const currentIdx = modes.indexOf(state.repeatMode);
      const nextIdx = (currentIdx + 1) % modes.length;
      return { repeatMode: modes[nextIdx] };
  }),
}));
