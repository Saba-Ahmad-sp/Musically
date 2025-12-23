"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, Volume2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export default function BottomPlayer() {
  const { 
    currentSong, 
    isPlaying, 
    play, 
    pause, 
    setSong, 
    setFullPlayerOpen, 
    setCurrentTime,
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  // Audio Logic
  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    // Auto-play prevention or interrupted
                    console.log("Playback prevented or interrupted handled");
                });
            }
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, currentSong]);

  // Removed redundant effect

  // Sync Audio with Store (for Seeking)
  useEffect(() => {
    if (audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 1.5) {
        audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Volume Sync
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newVolume = Math.max(0, Math.min(1, clickX / width));
      setVolume(newVolume);
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current && currentSong?.duration) {
        const current = audioRef.current.currentTime;
        const percent = (current / currentSong.duration) * 100;
        setProgress(percent);
        setCurrentTime(current); // Sync to store for FullPlayer
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation(); // Prevent opening full player when seeking
      if (!audioRef.current || !currentSong?.duration) return;
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * currentSong.duration;
      
      audioRef.current.currentTime = newTime;
      setProgress((clickX / width) * 100);
  };

  if (!currentSong) return null;

  const ControlsButtons = ({ mobile = false }) => (
    <div className={`flex items-center ${mobile ? 'justify-between w-full px-6 py-2' : 'gap-6 py-2'}`}>
        <button 
            onClick={toggleShuffle}
            className={`text-white/50 hover:text-white transition-colors ${isShuffle ? 'text-green-400 hover:text-green-300' : ''}`}
        >
            <Shuffle size={mobile ? 18 : 20} />
        </button>
        <button 
            onClick={prev}
            className="text-white/70 hover:text-white transition-colors"
        >
            <SkipBack size={mobile ? 24 : 28} fill="currentColor" />
        </button>
        <button 
            onClick={() => isPlaying ? pause() : play()}
            className={`bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg shadow-white/10 ${mobile ? 'w-12 h-12' : 'w-12 h-12'}`}
        >
            {isPlaying ? <Pause size={mobile ? 20 : 24} fill="black" /> : <Play size={mobile ? 20 : 24} fill="black" className="ml-1" />}
        </button>
        <button 
            onClick={next}
            className="text-white/70 hover:text-white transition-colors"
        >
            <SkipForward size={mobile ? 24 : 28} fill="currentColor" />
        </button>
        <button 
            onClick={toggleRepeat}
            className={`text-white/50 hover:text-white transition-colors ${repeatMode !== 'none' ? 'text-green-400 hover:text-green-300' : ''}`}
        >
            {repeatMode === 'one' ? <Repeat1 size={mobile ? 18 : 20} /> : <Repeat size={mobile ? 18 : 20} />}
        </button>
    </div>
  );

  const ProgressBar = ({ mobile = false }) => (
    <div className={`w-full flex items-center gap-2 text-xs text-white/50 font-mono ${mobile ? 'mt-auto' : ''}`}>
        <span className={mobile ? 'hidden' : 'hidden sm:block'}>{formatTime(currentTime)}</span>
         <div 
            className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer group relative"
            onClick={handleSeek}
         >
             <div 
                className="h-full bg-white group-hover:bg-green-400 rounded-full relative" 
                style={{ width: `${progress}%` }}
             >
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100" />
            </div>
        </div>
        <span className={mobile ? 'hidden' : 'hidden sm:block'}>{currentSong ? formatTime(currentSong.duration) : "0:00"}</span>
    </div>
  );

  const SongInfo = ({ mobile = false }) => (
      <div className={`flex items-center ${mobile ? 'w-full gap-3 px-1' : 'w-full md:w-1/3 md:flex-1 min-w-0 md:justify-start gap-3 md:pr-2'}`}>
         {!mobile && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full px-3 py-1 bg-black/80 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white/70">
                Click to Expand
            </div>
         )}

        <div className={`relative rounded-md overflow-hidden shadow-lg border border-white/10 ${mobile ? 'w-10 h-10' : 'w-14 h-14'}`}>
           <Image src={currentSong.coverUrl} alt={currentSong.title} fill className="object-cover" />
        </div>
        <div className="block ml-2 w-full overflow-hidden text-left">
            <h4 className="text-white font-medium truncate max-w-full md:max-w-[150px] text-sm md:text-base">{currentSong.title}</h4>
            <p className="text-xs text-white/50 truncate max-w-full md:max-w-[150px]">{currentSong.artist}</p>
        </div>
      </div>
  );

  return (
    <div 
        onClick={() => setFullPlayerOpen(true)}
        className="fixed bottom-[60px] md:bottom-0 left-0 w-full min-h-[120px] md:min-h-0 md:h-24 bg-black/80 backdrop-blur-3xl border-t border-white/10 z-50 px-4 py-3 md:py-0 md:px-6 cursor-pointer hover:bg-black/90 transition-colors group flex flex-col md:flex-row items-center justify-between"
    >
       {/* Hidden Audio */}
       <audio 
            ref={audioRef}
            src={currentSong.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
                pause();
            }}
       />

       {/* --- MOBILE LAYOUT (Buttons Top, Info Middle, Seek Bottom) --- */}
       <div className="md:hidden w-full flex flex-col h-full gap-2">
           <div onClick={(e) => e.stopPropagation()}>
               <ControlsButtons mobile={true} />
           </div>
           
           <SongInfo mobile={true} />
           
           <div onClick={(e) => e.stopPropagation()} className="w-full pb-1">
                <ProgressBar mobile={true} />
           </div>
       </div>


       {/* --- DESKTOP LAYOUT (Info Left, Controls Center, Volume Right) --- */}
       <div className="hidden md:contents">
           {/* Left: Song Info */}
           <SongInfo />

           {/* Center: Controls */}
           <div className="w-full md:w-1/3 flex flex-col items-center gap-1 md:gap-2 max-w-[500px]" onClick={(e) => e.stopPropagation()}>
                <ControlsButtons />
                <ProgressBar />
           </div>

           {/* Right: Volume/Extras */}
           <div className="hidden md:flex items-center justify-end gap-3 w-1/3 min-w-[150px]" onClick={(e) => e.stopPropagation()}>
                <Volume2 size={20} className="text-white/70" />
                <div 
                    className="w-24 h-1 bg-white/20 rounded-full cursor-pointer relative group/vol"
                    onClick={handleVolumeChange}
                >
                    <div 
                        className="h-full bg-white rounded-full group-hover/vol:bg-green-400 relative" 
                        style={{ width: `${volume * 100}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/vol:opacity-100" />
                    </div>
                </div>
           </div>
       </div>
    </div>
  );
}

function formatTime(seconds: number) {
    if(!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
