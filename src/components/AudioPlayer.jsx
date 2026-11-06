import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Attempt playback on first click anywhere on document if not already playing
    const handleFirstClick = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // User policy prevented playback
        });
      }
      window.removeEventListener('click', handleFirstClick);
    };

    window.addEventListener('click', handleFirstClick, { once: true });
    return () => window.removeEventListener('click', handleFirstClick);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log('Audio playback waiting for interaction:', err);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#1b082e]/90 backdrop-blur-xl border border-amber-300/30 rounded-full px-3.5 py-2 shadow-2xl transition-all hover:border-amber-400">
      <audio
        ref={audioRef}
        src="/music/birthday_melody.mp3"
        loop
        preload="auto"
      />

      {/* Music Icon & Animated equalizer bars */}
      <button
        onClick={togglePlay}
        className="flex items-center gap-2 text-xs font-semibold text-amber-200 hover:text-white transition-colors"
        title={isPlaying ? 'Pause Birthday Music' : 'Play Birthday Music'}
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-amber-400 flex items-center justify-center text-purple-950 shadow-md">
          {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
        </div>
        <span className="hidden sm:inline">
          {isPlaying ? 'Birthday Melody' : 'Play Music'}
        </span>
      </button>

      {/* Equalizer Bars */}
      {isPlaying && !isMuted && (
        <div className="flex items-end gap-0.5 h-3.5 px-1">
          <div className="w-1 bg-pink-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
          <div className="w-1 bg-amber-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-2" />
          <div className="w-1 bg-purple-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.4s] h-3.5" />
          <div className="w-1 bg-pink-300 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.1s] h-2.5" />
        </div>
      )}

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className="p-1.5 rounded-full hover:bg-purple-900/60 text-purple-300 hover:text-white transition-colors"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </div>
  );
}

