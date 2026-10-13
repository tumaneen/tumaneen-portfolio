import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const SoundscapePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<any[]>([]);

  const startSoundscape = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 3);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // 1. Deep warm cosmic fundamental drone (55Hz and 110Hz harmonics)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // Low A

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(82.4, ctx.currentTime); // Gentle fifth (E)

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);
      filter.Q.setValueAtTime(2, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();

      // 2. Analog vinyl/tape crackle simulation via procedural buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Random sparse pops like analog vinyl
        if (Math.random() < 0.002) {
          output[i] = (Math.random() * 2 - 1) * 0.4;
        } else {
          output[i] = (Math.random() * 2 - 1) * 0.015;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1200, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.2, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, ctx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      whiteNoise.start();

      nodesRef.current = [osc1, osc2, whiteNoise, filter, noiseFilter, noiseGain];
      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio not allowed without interaction', e);
    }
  };

  const stopSoundscape = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        const ctx = audioCtxRef.current;
        gainNodeRef.current.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
        setTimeout(() => {
          nodesRef.current.forEach((node) => {
            try {
              if (node.stop) node.stop();
              node.disconnect();
            } catch (_) {}
          });
          nodesRef.current = [];
          if (audioCtxRef.current?.state !== 'closed') {
            audioCtxRef.current?.close();
          }
          audioCtxRef.current = null;
        }, 900);
      } catch (_) {}
    }
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSoundscape();
    } else {
      startSoundscape();
    }
  };

  useEffect(() => {
    return () => {
      stopSoundscape();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? 'Mute cosmic soundscape' : 'Listen to retro vinyl space ambience'}
      aria-label="Toggle retro space vinyl soundscape"
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono tracking-wider transition-all border border-orange-500/20 hover:border-orange-500/50 bg-[#140f0c]/80 text-[#e7d8cc]/80 hover:text-orange-400 group cursor-pointer"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
          <span className="text-[11px] text-orange-400">VINYL: ON</span>
          <span className="flex gap-0.5 items-end h-2.5">
            <span className="w-0.5 h-2 bg-orange-500/70 animate-pulse"></span>
            <span className="w-0.5 h-3 bg-orange-400 animate-pulse delay-75"></span>
            <span className="w-0.5 h-1.5 bg-orange-500/80 animate-pulse delay-150"></span>
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-stone-500 group-hover:text-orange-400" />
          <span className="text-[11px] text-stone-400 group-hover:text-stone-300">VINYL: OFF</span>
        </>
      )}
    </button>
  );
};
