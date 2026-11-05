import { useRef, useState, useCallback } from 'react';

export function useEmergencyAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  const startSiren = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop any existing oscillator
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;

      // Modulate frequency to create European/Police high-low siren sweep
      let toggle = false;
      intervalRef.current = window.setInterval(() => {
        if (!oscillatorRef.current || !audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        const targetFreq = toggle ? 700 : 1250;
        oscillatorRef.current.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.35);
        toggle = !toggle;
      }, 400);

      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to start emergency audio siren:', err);
    }
  }, []);

  const stopSiren = useCallback(() => {
    try {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
    } catch (err) {
      console.error('Failed to stop emergency audio siren:', err);
    }
  }, []);

  return { isPlaying, startSiren, stopSiren };
}
