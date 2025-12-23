"use client";

import { Song } from "@/types/music";
import { usePlayerStore } from "@/store/usePlayerStore";
import Image from "next/image";
import { Play, Heart } from "lucide-react";

interface SongGridProps {
  songs: Song[];
  title: string;
}

export default function SongGrid({ songs, title }: SongGridProps) {
  const { setSong, currentSong, isPlaying, play, pause, toggleLike, likedSongs } = usePlayerStore();

  return (
    <div className="p-6 md:p-8 pb-32">
      <h2 className="text-3xl font-playfair font-bold text-white mb-6">{title}</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {songs.map((song) => {
           const isActive = currentSong?.id === song.id;
           const isLiked = likedSongs.some(s => s.id === song.id);

           return (
            <div 
                key={song.id}
                onClick={() => setSong(song)}
                className="group bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-white/5 relative"
            >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 shadow-lg">
                    <Image src={song.coverUrl} alt={song.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    
                    {/* Top Right Like Button */}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(song);
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 hover:scale-110 z-10"
                    >
                        <Heart size={18} className={isLiked ? "fill-green-500 text-green-500" : "text-white"} />
                    </button>

                    {/* Play Button Overlay */}
                    <div className={`absolute bottom-2 right-2 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : ''}`}>
                         {isActive && isPlaying ? (
                            <div className="w-3 h-3 bg-black rounded-sm" /> // Pause icon
                         ) : (
                            <Play fill="black" size={24} className="ml-1 text-black" />
                         )}
                    </div>
                </div>

                <h3 className={`font-bold truncate ${isActive ? 'text-green-400' : 'text-white'}`}>{song.title}</h3>
                <p className="text-sm text-white/60 truncate mt-1">{song.artist}</p>
            </div>
           );
        })}
      </div>
    </div>
  );
}
