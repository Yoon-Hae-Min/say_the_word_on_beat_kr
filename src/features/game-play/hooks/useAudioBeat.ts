import { useEffect, useRef, useState } from "react";

interface UseAudioBeatOptions {
	src: string;
	bpm: number;
	onBeat?: (beat: number) => void;
	onBeatEnd?: () => void;
	offsetSec?: number; // 🔑 박자 구간을 앞당길 시간 (초)
	playbackRate?: number; // 재생 속도 (기본값: 1.0)
	autoPlay?: boolean; // 자동 재생 여부 (기본값: true)
}

interface UseAudioBeatReturn {
	play: () => void;
	stop: () => void;
	isPlaying: boolean;
}

export function useAudioBeat({
	src,
	bpm,
	onBeat,
	onBeatEnd,
	offsetSec = 0,
	playbackRate = 1,
	autoPlay = true,
}: UseAudioBeatOptions): UseAudioBeatReturn {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const rafRef = useRef<number | null>(null);

	const [isPlaying, setIsPlaying] = useState(false);
	const lastBeatRef = useRef(-1);
	const beatStartTimeRef = useRef(0);

	const tick = () => {
		if (!audioRef.current) return;

		const elapsed = audioRef.current.currentTime - beatStartTimeRef.current;

		const beatLength = 60 / bpm;

		// ✅ 핵심: 박자 구간을 offsetSec 만큼 앞으로 당김
		const shiftedElapsed = elapsed + offsetSec;

		const beatIndex = Math.floor(shiftedElapsed / beatLength);

		if (beatIndex > lastBeatRef.current && beatIndex >= 0) {
			lastBeatRef.current = beatIndex;
			onBeat?.(beatIndex);
		}

		rafRef.current = requestAnimationFrame(tick);
	};

	// 음악이 끝났을 때 호출
	const handleEnded = () => {
		setIsPlaying(false);
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
		onBeatEnd?.();
	};

	// Play 함수
	const play = () => {
		if (!audioRef.current || isPlaying) return;

		setIsPlaying(true);

		lastBeatRef.current = -1;

		audioRef.current
			.play()
			.then(() => {
				if (!audioRef.current) return;
				beatStartTimeRef.current = audioRef.current.currentTime;
				tick();
			})
			.catch((error) => {
				console.error("Audio play failed:", error);
				setIsPlaying(false);
			});
	};

	// Stop 함수
	const stop = () => {
		if (!audioRef.current) return;

		setIsPlaying(false);
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}

		audioRef.current.pause();
		audioRef.current.currentTime = 0;
		lastBeatRef.current = -1;
	};

	// 오디오 초기화 및 정리
	useEffect(() => {
		const audio = new Audio(src);
		audio.playbackRate = playbackRate;
		audioRef.current = audio;

		audio.addEventListener("ended", handleEnded);

		// autoPlay가 true이면 자동 재생
		if (autoPlay) {
			play();
		}

		return () => {
			stop();
			audio.removeEventListener("ended", handleEnded);
			audioRef.current = null;
		};
	}, [src, playbackRate, autoPlay]);

	return {
		play,
		stop,
		isPlaying,
	};
}
