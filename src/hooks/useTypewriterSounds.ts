import { useCallback, useRef } from 'react';

export const useTypewriterSounds = () => {
  const audioCtx = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playClick = useCallback(() => {
    initAudio();
    if (!audioCtx.current) return;

    const oscillator = audioCtx.current.createOscillator();
    const gainNode = audioCtx.current.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, audioCtx.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.current.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);

    oscillator.start();
    oscillator.stop(audioCtx.current.currentTime + 0.1);

    // Add a second noise burst for a more mechanical "clack"
    const bufferSize = audioCtx.current.sampleRate * 0.05;
    const buffer = audioCtx.current.createBuffer(1, bufferSize, audioCtx.current.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.current.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = audioCtx.current.createGain();
    noiseGain.gain.setValueAtTime(0.05, audioCtx.current.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.05);

    noise.connect(noiseGain);
    noiseGain.connect(audioCtx.current.destination);
    noise.start();
  }, []);

  const playDing = useCallback(() => {
    initAudio();
    if (!audioCtx.current) return;

    const oscillator = audioCtx.current.createOscillator();
    const gainNode = audioCtx.current.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.current.currentTime); // High pitch A5
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);

    oscillator.start();
    oscillator.stop(audioCtx.current.currentTime + 0.5);
  }, []);

  return { playClick, playDing };
};
