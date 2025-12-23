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
import { Search, Home, Library, Heart, Plus } from "lucide-react";
import { api } from "@/lib/api";

interface PlayerContainerProps {
  initialSongs: Song[];
}

export default function PlayerContainer({ initialSongs }: PlayerContainerProps) {
  const { currentSong, setSong, isFullPlayerOpen, setQueue, activeTab, setActiveTab, likedSongs, searchQuery, setSearchQuery, searchResults, setSearchResults } = usePlayerStore();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    setQueue(initialSongs);
  }, [initialSongs, setQueue]);

  // Search API Logic
  useEffect(() => {
      const delayDebounceFn = setTimeout(async () => {
          if (searchQuery.trim().length > 0) {
              const results = await api.searchSongs(searchQuery);
              setSearchResults(results);
          } else {
              setSearchResults([]);
          }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, setSearchResults]);

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
                 </div>
             ) : (
                <>
                     {/* Mobile Logo */}
                     <div className="md:hidden">
                        <h1 className="text-xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            Musically
                        </h1>
                     </div>

                    {/* Desktop Placeholder (Empty for now as requested previously) */}
                    <div className="hidden md:block" />

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

         {/* Mobile Tabs Navigation */}
         <div className="md:hidden w-full px-4 py-4 overflow-x-auto custom-scrollbar flex items-center justify-center gap-3 sticky top-16 z-30 bg-black/20 backdrop-blur-sm border-b border-white/5">
             <TabButton 
                icon={<Home size={18} />} 
                label="Home" 
                active={activeTab === 'Home'} 
                onClick={() => setActiveTab('Home')}
             />
             <TabButton 
                icon={<Library size={18} />} 
                label="Library" 
                active={activeTab === 'Library'}
                onClick={() => setActiveTab('Library')}
             />
             <TabButton 
                icon={<Heart size={18} />} 
                label="Liked" 
                active={activeTab === 'Liked'}
                onClick={() => setActiveTab('Liked')}
             />
             <TabButton 
                icon={<Plus size={18} />} 
                label="Create" 
                active={activeTab === 'Create'}
                onClick={() => setActiveTab('Create')}
             />
         </div>

         <div className="w-full max-w-[1920px] mx-auto pt-4 md:pt-0">
             {searchQuery.length > 0 ? (
                 <SongGrid songs={searchResults} title={`Search Results for "${searchQuery}"`} />
             ) : (
                activeTab === 'Liked' ? (
                     likedSongs.length > 0 ? (
                        <SongGrid songs={likedSongs} title="Your Liked Songs" />
                     ) : (
                        <div className="p-8 text-center text-white/50">
                            <Heart size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No liked songs yet. Go explore!</p>
                        </div>
                     )
                 ) : (
                     <>
                        <SongGrid songs={initialSongs} title="Recommended for You" />
                        <SongGrid songs={[...initialSongs].reverse()} title="Trending Now" />
                     </>
                 )
             )}
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
                className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-3xl pt-8"
            >
                <FullPlayer initialSongs={initialSongs} />
            </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Player (Fixed) */}
      {/* Hide bottom player when full player is open OR keep it? Usually hidden or effectively replaced. 
          The FullPlayer has its own controls. Let's keep it mounted but maybe z-index lower or let FullPlayer cover it.
          Since FullPlayer has z-[60] and BottomPlayer has z-50, FullPlayer covers it. 
      */}
      <BottomPlayer />

    </div>
  );
}

function TabButton({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
            ${active 
                ? 'bg-white text-black shadow-lg shadow-white/10' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    )
}
