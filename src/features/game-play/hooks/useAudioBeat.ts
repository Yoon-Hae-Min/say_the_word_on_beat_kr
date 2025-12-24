import { useEffect, useRef } from "react";

interface UseAudioBeatOptions {
  src: string;
  bpm: number;
  onBeat: (beat: number) => void;
  offsetSec?: number; // 🔑 박자 구간을 앞당길 시간 (초)
}

export function useAudioBeat({
  src,
  bpm,
  onBeat,
  offsetSec = 0,
}: UseAudioBeatOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const isPlayingRef = useRef(false);
  const lastBeatRef = useRef(-1);
  const beatStartTimeRef = useRef(0);
  const onBeatRef = useRef(onBeat);

  useEffect(() => {
    onBeatRef.current = onBeat;
  }, [onBeat]);

  const tick = () => {
    if (!isPlayingRef.current || !audioRef.current) return;

    const elapsed = audioRef.current.currentTime - beatStartTimeRef.current;

    const beatLength = 60 / bpm;

    // ✅ 핵심: 박자 구간을 offsetSec 만큼 앞으로 당김
    const shiftedElapsed = elapsed + offsetSec;

    const beatIndex = Math.floor(shiftedElapsed / beatLength);

    if (beatIndex > lastBeatRef.current && beatIndex >= 0) {
      lastBeatRef.current = beatIndex;
      onBeatRef.current(beatIndex);
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.play().then(() => {
      isPlayingRef.current = true;
      lastBeatRef.current = -1;
      beatStartTimeRef.current = audio.currentTime;
      tick();
    });

    return () => {
      isPlayingRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audio.pause();
    };
  }, [src, bpm, offsetSec]);

  return null;
}
