import { useEffect, useRef } from "react";

interface UseAudioBeatOptions {
  src: string;
  bpm: number;
  onBeat: (beat: number) => void;
  phaseRatio?: number; // 0~1 (박자 길이 대비 앞당길 비율)
}

export function useAudioBeat({
  src,
  bpm,
  onBeat,
  phaseRatio = 0, // 예: 0.33
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

    // 🔑 박자 구간 자체를 앞당김
    const phaseOffset = beatLength * phaseRatio;
    const shiftedElapsed = elapsed + phaseOffset;

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
  }, [src, bpm, phaseRatio]);

  return null;
}
