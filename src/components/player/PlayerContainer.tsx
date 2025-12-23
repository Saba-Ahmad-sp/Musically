"use client";

import { Song } from "@/types/music";
import { usePlayerStore } from "@/store/usePlayerStore";
import Sidebar from "@/components/layout/Sidebar";
import BottomPlayer from "@/components/player/BottomPlayer";
import SongGrid from "@/components/main/SongGrid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FullPlayer from "./FullPlayer";
import { Search, Home, Zap, Heart, Plus, Play } from "lucide-react";
import { api } from "@/lib/api";

interface PlayerContainerProps {
  initialSongs: Song[];
}

export default function PlayerContainer({ initialSongs }: PlayerContainerProps) {
  const { currentSong, setSong, isFullPlayerOpen, setQueue, activeTab, setActiveTab, likedSongs, searchQuery, setSearchQuery, searchResults, setSearchResults, isSearching, setIsSearching } = usePlayerStore();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    setQueue(initialSongs);
  }, [initialSongs, setQueue]);

  // Search API Logic
  useEffect(() => {
      if (searchQuery.trim().length === 0) {
          setSearchResults([]);
          setIsSearching(false);
          return;
      }

      setIsSearching(true);
      const delayDebounceFn = setTimeout(async () => {
          if (searchQuery.trim().length > 0) {
              const results = await api.searchSongs(searchQuery);
              setSearchResults(results);
          } else {
              setSearchResults([]);
          }
          setIsSearching(false);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, setSearchResults, setIsSearching]);

  // Initialize store (optional, as we might want to start empty or with first song)
   useEffect(() => {
    if (!currentSong && initialSongs.length > 0) {
      setSong(initialSongs[0]); // Set but don't play
    }
  }, [initialSongs, currentSong, setSong]);

  return (
    <div className="relative w-full h-screen flex overflow-hidden bg-black text-white">
      
       {/* Global Cinematic Background */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {currentSong?.coverUrl && (
          <Image
            src={currentSong.coverUrl}
            alt="Background"
            fill
            className="object-cover blur-[100px] opacity-30"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
      </div>
      
      {/* Sidebar (Left) */}
      <Sidebar />

      {/* Main Scrollable Content (Right) */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full">
         {/* Navbar / Header */}
         <div className="w-full h-16 sticky top-0 bg-black/40 backdrop-blur-md z-40 flex items-center justify-between px-6 border-b border-white/5 shadow-sm">
             {isMobileSearchOpen ? (
                 <div className="flex items-center w-full gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                     <Search size={20} className="text-white/50" />
                     <input 
                        type="text" 
                        autoFocus
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30"
                     />
                     <button onClick={() => { setIsMobileSearchOpen(false); setSearchQuery(""); }} className="text-white/50 p-2">
                        Close
                     </button>
                    {/* Mobile Search Results Dropdown */}
                     {searchQuery.length > 0 && (
                        <div className="absolute top-16 left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 max-h-[60vh] overflow-y-auto p-2 shadow-2xl">
                             {isSearching ? (
                                <div className="p-4 text-center text-white/50">Searching...</div>
                             ) : searchResults.length > 0 ? (
                                 <div className="space-y-1">
                                    {searchResults.map(song => (
                                         <div key={song.id} 
                                              className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg"
                                              onClick={() => { setSong(song); setIsMobileSearchOpen(false); setSearchQuery(''); }}
                                         >
                                            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                                <Image src={song.coverUrl} alt={song.title} fill className="object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-medium text-white truncate">{song.title}</h4>
                                                <p className="text-xs text-white/50 truncate">{song.artist}</p>
                                            </div>
                                         </div>
                                    ))}
                                 </div>
                             ) : (
                                <div className="p-4 text-center text-white/50">No results found</div>
                             )}
                        </div>
                     )}
                 </div>
             ) : (
                <>
                     {/* Mobile Logo */}
                     <div className="md:hidden">
                        <h1 className="text-xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            Musically
                        </h1>
                     </div>

                    {/* Desktop Search Bar (Right Aligned) */}
                    <div className="hidden md:flex relative ml-auto z-50">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-[300px] focus-within:bg-white/10 focus-within:border-white/20 transition-all">
                            <Search size={18} className="text-white/50" />
                            <input 
                                type="text" 
                                placeholder="Search Songs, Artists..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-white placeholder-white/30 text-sm w-full"
                            />
                        </div>
                        {/* Desktop Dropdown Result */}
                        {searchQuery.length > 0 && (
                            <div className="absolute top-full right-0 mt-2 w-[400px] bg-black/90 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden max-h-[500px] overflow-y-auto custom-scrollbar ring-1 ring-white/5">
                                {isSearching ? (
                                    <div className="p-4 text-center text-white/50 flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Searching...
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="p-2">
                                        <h3 className="text-[10px] font-bold text-white/40 uppercase px-2 mb-2 tracking-wider">Top Results</h3>
                                        {searchResults.map(song => (
                                            <div key={song.id} 
                                                className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer group transition-colors"
                                                onClick={() => { setSong(song); setSearchQuery(''); }}
                                            >
                                                <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                                    <Image src={song.coverUrl} alt={song.title} fill className="object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Play size={16} fill="white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-white truncate">{song.title}</h4>
                                                    <p className="text-xs text-white/50 truncate">{song.artist}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-white/50">No results found.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Search Button */}
                    <button 
                        onClick={() => setIsMobileSearchOpen(true)}
                        className="md:hidden p-2 rounded-full hover:bg-white/10 text-white/90"
                    >
                        <Search size={24} />
                    </button>
                </>
             )}
         </div>

         <div className="w-full max-w-[1920px] mx-auto pt-4 md:pt-0 pb-48">
            {activeTab === 'Liked' ? (
                    likedSongs.length > 0 ? (
                    <SongGrid songs={likedSongs} title="Your Liked Songs" />
                    ) : (
                    <div className="p-8 text-center text-white/50">
                        <Heart size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No liked songs yet. Go explore!</p>
                    </div>
                    )
                ) : activeTab === 'Trending' ? (
                    <SongGrid songs={[...initialSongs].reverse()} title="Trending Now" />
                ) : (
                    <SongGrid songs={initialSongs} title="Weekly Top Picks" />
                )
            }
         </div>
      </main>

      {/* Full Screen Player Overlay (Slide Up Transition) */}
      <AnimatePresence>
        {isFullPlayerOpen && (
            <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-3xl pt-8"
            >
                <FullPlayer initialSongs={initialSongs} />
            </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tabs Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-[60px] bg-black/95 backdrop-blur-xl border-t border-white/10 z-[60] grid grid-cols-4 gap-1 px-2 py-1 items-center">
            <TabButton 
            icon={<Home size={20} />} 
            label="Home" 
            active={activeTab === 'Home'} 
            onClick={() => setActiveTab('Home')}
            />
            <TabButton 
            icon={<Zap size={20} />} 
            label="Trending" 
            active={activeTab === 'Trending'} 
            onClick={() => setActiveTab('Trending')}
            />
            <TabButton 
            icon={<Heart size={20} />} 
            label="Liked" 
            active={activeTab === 'Liked'}
            onClick={() => setActiveTab('Liked')}
            />
            <TabButton 
            icon={<Plus size={20} />} 
            label="Create" 
            active={activeTab === 'Create'}
            onClick={() => setActiveTab('Create')}
            />
      </div>

      {/* Bottom Player (Fixed) */}
      {/* Sits above tabs on mobile (bottom-[60px]) and at bottom on desktop (bottom-0) */}
      <BottomPlayer />

    </div>
  );
}

function TabButton({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button 
            onClick={onClick}
            title={label}
            className={`flex items-center justify-center py-1 rounded-lg transition-colors w-full h-full
            ${active 
                ? 'text-white' 
                : 'text-white/50 hover:text-white/80'
            }`}
        >
            <div className={`transition-transform ${active ? 'scale-125' : 'scale-100'}`}>
                {icon}
            </div>
        </button>
    )
}
