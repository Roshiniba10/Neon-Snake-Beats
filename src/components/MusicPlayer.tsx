import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Zap } from 'lucide-react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'SIGNAL_LOST',
    artist: 'VOID_ENGINE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/glitch1/400/400?grayscale',
  },
  {
    id: '2',
    title: 'DATA_GHOST',
    artist: 'NULL_POINTER',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/glitch2/400/400?grayscale',
  },
  {
    id: '3',
    title: 'CORE_DUMP',
    artist: 'BUFFER_OVERFLOW',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/glitch3/400/400?grayscale',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <div className="w-80 bg-black border-4 border-cyan-500 p-4 flex flex-col gap-4 shadow-[8px_8px_0_#0ff,-8px_-8px_0_#f0f]">
      <div className="relative aspect-square border-2 border-magenta-500 overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.1 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale contrast-150"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
        <div className="absolute bottom-2 left-2 right-2 bg-black/80 p-2 border-l-4 border-magenta-500">
          <h3 className="text-cyan-400 font-mono text-sm glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-magenta-500 text-[10px] font-mono">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="h-4 w-full bg-cyan-900/30 border border-cyan-500 relative overflow-hidden">
          <div
            className="h-full bg-magenta-500 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-cyan-400 pointer-events-none">
            STREAMING_PACKETS... {Math.floor(progress)}%
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button className="text-cyan-900 hover:text-cyan-400 transition-colors">
          <Zap size={14} />
        </button>
        <div className="flex items-center gap-4">
          <button onClick={skipBack} className="text-cyan-400 hover:text-magenta-500 transition-colors">
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 border-4 border-cyan-400 flex items-center justify-center text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all active:translate-y-1"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          <button onClick={skipForward} className="text-cyan-400 hover:text-magenta-500 transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
        <button className="text-cyan-900 hover:text-cyan-400 transition-colors">
          <Music size={14} />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />
    </div>
  );
};
