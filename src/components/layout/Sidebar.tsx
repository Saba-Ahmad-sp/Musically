"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { Home, Search, Zap, Plus, Heart } from "lucide-react";

export default function Sidebar() {
  const { searchQuery, setSearchQuery, activeTab, setActiveTab } = usePlayerStore();
  return (
    <div className="w-64 h-full hidden md:flex flex-col bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex-shrink-0 z-20">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Musically
        </h1>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-3">
          <button 
            onClick={() => setActiveTab('Home')}
            className={`flex items-center gap-4 text-white hover:text-purple-400 transition-colors px-2 py-2 rounded-lg hover:bg-white/5 w-full ${activeTab === 'Home' ? 'text-purple-400 bg-white/5' : ''}`}
          >
            <Home size={24} />
            <span className="font-medium">Home</span>
          </button>
          
          <div className="relative group">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors">
                  <Search size={24} />
              </div>
              <input 
                  type="text" 
                  placeholder="Search Songs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border border-transparent focus:border-white/10 rounded-lg py-2 pl-10 pr-2 text-white placeholder-white/30 focus:bg-white/5 outline-none transition-all"
              />
          </div>
          <button 
            onClick={() => setActiveTab('Trending')}
            className={`flex items-center gap-4 text-white hover:text-purple-400 transition-colors px-2 py-2 rounded-lg hover:bg-white/5 w-full ${activeTab === 'Trending' ? 'text-purple-400 bg-white/5' : ''}`}
          >
            <Zap size={24} />
            <span className="font-medium">Trending</span>
          </button>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3">
             <button className="flex items-center gap-4 text-white/70 hover:text-white transition-colors px-2 py-2 rounded-lg hover:bg-white/5 w-full group">
                <div className="bg-white/10 p-1 rounded-sm group-hover:bg-white/20">
                    <Plus size={16} />
                </div>
                <span className="font-medium">Create Playlist</span>
            </button>
            <button className="flex items-center gap-4 text-white/70 hover:text-white transition-colors px-2 py-2 rounded-lg hover:bg-white/5 w-full group">
                 <div className="bg-gradient-to-br from-purple-700 to-blue-300 p-1 rounded-sm opacity-70 group-hover:opacity-100">
                    <Heart size={16} fill="white" stroke="none"/>
                </div>
                <span className="font-medium">Liked Songs</span>
            </button>
        </div>
      </div>
      
      <div className="text-xs text-white/30 pt-4 border-t border-white/5">
        <p>Legal</p>
        <p>Privacy Center</p>
      </div>
    </div>
  );
}
