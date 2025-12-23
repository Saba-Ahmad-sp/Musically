"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { Song } from "@/types/music";
import Image from "next/image";
import { ChevronDown, Volume2, Shuffle, Repeat, Repeat1 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface FullPlayerProps {
  initialSongs: Song[];
}

export default function FullPlayer({ initialSongs }: FullPlayerProps) {
  const { 
    currentSong, 
    isPlaying, 
    play, 
    pause, 
    setSong, 
    setFullPlayerOpen, 
    currentTime, 
    volume, 
    setVolume,
    isShuffle,
    repeatMode,
    toggleShuffle,
    toggleRepeat,
    next,
    prev
  } = usePlayerStore();
  
  
  const activeSong = currentSong || initialSongs[0];
  const progressPercent = activeSong.duration ? (currentTime / activeSong.duration) * 100 : 0;

  // Dragging state for seek bar
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const calculateTime = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
      if (!progressBarRef.current || !activeSong?.duration) return 0;
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      return (x / rect.width) * activeSong.duration;
  };

  const handleSeekStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    const newTime = calculateTime(e);
    usePlayerStore.getState().setCurrentTime(newTime);
    
    // Capture pointer for smooth dragging outside the bar
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleSeekMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const newTime = calculateTime(e);
      usePlayerStore.getState().setCurrentTime(newTime);
  };

  const handleSeekEnd = (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
// ... keep existing handleVolumeChange
// (redacted for brevity in instruction reuse, but in actual replace ensure we don't clobber it if not targeted)
// actually the target content below includes handleSeek, so I should replace the block before return.
// Re-adding handleVolumeChange here to be safe and complete.
      e.stopPropagation();
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newVolume = Math.max(0, Math.min(1, clickX / width));
      setVolume(newVolume);
  };

   return (
    <div className="flex flex-col h-full w-full max-w-[1920px] mx-auto p-6 md:p-12 gap-8 md:gap-12 overflow-y-auto custom-scrollbar">
      
      {/* ... Header and Left Side ... */}
      {/* Header / Close Button */}
      <div className="flex justify-between items-center w-full">
         <button 
            onClick={() => setFullPlayerOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
         >
             <ChevronDown size={32} className="text-white" />
         </button>
         <div className="text-center">
             <span className="text-xs font-bold tracking-widest uppercase text-white/70">Playing From Playlist</span>
             <p className="font-bold text-white text-sm">Recommended for You</p>
         </div>
         <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-shrink-0 md:flex-1 flex flex-col md:flex-row items-center md:items-stretch justify-center gap-8 md:gap-16 md:min-h-0">
        
        {/* Left Side: Artwork & Controls */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start justify-center space-y-8">
            {/* Artwork */}
             <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-full md:aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/10 group mx-auto md:mx-0">
                 {activeSong?.coverUrl && (
                    <Image
                        src={activeSong.coverUrl}
                        alt={activeSong.title}
                        fill
                        className={`object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
                    />
                )}
            </div>
            
            <div className="text-center md:text-left space-y-1 w-full flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-white tracking-tight drop-shadow-lg line-clamp-1">
                        {activeSong?.title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 font-light tracking-widest uppercase truncate">
                        {activeSong?.artist}
                    </p>
                </div>
            </div>

            {/* Scrubber & Main Controls */}
             <div className="w-full flex flex-col gap-6 mt-auto">
                 {/* Progress Bars */}
                 <div className="w-full flex items-center gap-3">
                     <span className="text-xs text-white/50 font-mono w-10 text-right">{formatDuration(currentTime)}</span>
                     <div 
                        ref={progressBarRef}
                        className="flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer group relative py-2 -my-2 flex items-center touch-none"
                        onPointerDown={handleSeekStart}
                        onPointerMove={handleSeekMove}
                        onPointerUp={handleSeekEnd}
                        onPointerLeave={handleSeekEnd}
                     >
                         <div className="w-full h-1.5 rounded-full overflow-hidden relative">
                             <div 
                                className={`h-full bg-white group-hover:bg-green-400 relative rounded-full ${isDragging ? 'bg-green-400' : ''}`}
                                style={{ width: `${progressPercent}%` }}
                             >
                                 <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
                             </div>
                         </div>
                     </div>
                     <span className="text-xs text-white/50 font-mono w-10">{formatDuration(activeSong.duration)}</span>
                 </div>
                 
                 {/* Remove redundant separate time labels since we integrated them */}


                 {/* Big Buttons */}
                 <div className="flex items-center justify-between w-full px-4 md:px-0">
                     <button 
                        onClick={toggleShuffle}
                        className={`text-white/70 hover:text-white transition-colors ${isShuffle ? 'text-green-400 hover:text-green-300' : ''}`}
                     >
                        <Shuffle size={32} />
                     </button>
                    <button 
                        className="text-white hover:text-purple-400 transition-colors duration-200"
                         onClick={prev}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10">
                          <path d="M19 20L9 12l10-8v16zM5 4h2v16H5V4z" />
                        </svg>
                    </button>
                    
                     <button 
                        onClick={() => isPlaying ? pause() : play()}
                        className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-200"
                     >
                         {isPlaying ? (
                             <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" className="w-10 h-10">
                               <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                             </svg>
                         ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" className="w-10 h-10 ml-1">
                               <path d="M8 5v14l11-7z" />
                             </svg>
                         )}
                     </button>
                     
                     <button 
                        className="text-white hover:text-purple-400 transition-colors duration-200"
                         onClick={next}
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10">
                          <path d="M5 4l10 8-10 8V4zm14 0h2v16h-2V4z" />
                        </svg>
                    </button>
                    
                     <button 
                        onClick={toggleRepeat}
                        className={`text-white/70 hover:text-white transition-colors relative ${repeatMode !== 'none' ? 'text-green-400 hover:text-green-300' : ''}`}
                     >
                        {repeatMode === 'one' ? <Repeat1 size={32} /> : <Repeat size={32} />}
                        {repeatMode !== 'none' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full" />}
                     </button>
                 </div>

                 {/* Volume Control (New) */}
                 <div className="w-full flex items-center justify-center gap-4 px-8 mt-4">
                     <Volume2 size={20} className="text-white/60" />
                     <div 
                        className="w-full max-w-[200px] h-1.5 bg-white/20 rounded-full cursor-pointer relative group"
                        onClick={handleVolumeChange}
                     >
                         <div 
                            className="h-full bg-white rounded-full group-hover:bg-purple-400 relative transition-all"
                            style={{ width: `${volume * 100}%` }}
                         >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100" />
                         </div>
                     </div>
                 </div>
            </div>
        </div>

        {/* Right Side: Playlist */}
        <div className="flex flex-col w-full md:w-2/3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl mt-0 h-auto self-stretch">
            <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-10">
                 <h2 className="text-xl font-playfair text-white font-bold tracking-wide">Up Next</h2>
            </div>
            
             <div className="md:flex-1 md:overflow-y-auto custom-scrollbar p-3 space-y-2">
                {initialSongs.map((song) => (
                    <div 
                        key={song.id} 
                        onClick={() => setSong(song)}
                        className={`group p-3 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-300 border border-transparent
                            ${activeSong?.id === song.id 
                                ? 'bg-white/15 border-purple-500/30 shadow-lg shadow-purple-900/10' 
                                : 'hover:bg-white/10 hover:border-white/5'
                            }`}
                    >
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image 
                                src={song.coverUrl} 
                                alt={song.title} 
                                fill
                                className="object-cover"
                            />
                             {activeSong?.id === song.id && isPlaying && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce mx-0.5" style={{ animationDelay: '0s' }} />
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce mx-0.5" style={{ animationDelay: '0.1s' }} />
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce mx-0.5" style={{ animationDelay: '0.2s' }} />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <p className={`font-medium text-base truncate ${activeSong?.id === song.id ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
                                {song.title}
                            </p>
                            <p className="text-sm text-white/50 truncate group-hover:text-white/70">
                                {song.artist}
                            </p>
                        </div>
                         <div className="text-white/40 text-sm hidden sm:block">
                            {formatDuration(song.duration)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
   );
}

function formatDuration(seconds: number) {
    if(!seconds) return "--:--";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
