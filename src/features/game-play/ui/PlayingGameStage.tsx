import Image from "next/image";
import { useState } from "react";
import type { DatabaseChallenge } from "@/entities/challenge";
import { useAudioBeat } from "../hooks/useAudioBeat";

interface PlayingGameStage {
	challengeData: DatabaseChallenge;
	onPlayingEnd: () => void;
}

const BPM = 182;
const BLOCK_SIZE = 8;
const STEPS = 8;
const ROUND_BEATS = 16;

const PlayingGameStage = ({ challengeData, onPlayingEnd }: PlayingGameStage) => {
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
	const [currentRound, setCurrentRound] = useState(1);

	const slots = challengeData.game_config?.[currentRound - 1].slots;
	const totalRounds = challengeData.game_config?.length;

	useAudioBeat({
		src: "/song.mp3",
		bpm: BPM,
		offsetSec: 0.03,
		onBeatEnd: () => {
			onPlayingEnd();
		},
		onBeat: (beat) => {
			console.log(beat);
			const round = Math.floor(beat / ROUND_BEATS) + 1;
			if (round > totalRounds) {
				setFocusedIndex(null);
				return;
			}

			setCurrentRound(round);

			const blockIndex = Math.floor(beat / BLOCK_SIZE);
			const isActiveBlock = blockIndex % 2 === 1;

			if (!isActiveBlock) {
				setFocusedIndex(null);
			} else {
				setFocusedIndex(beat % STEPS);
			}
		},
	});

	return (
		<div className="relative flex items-center justify-center h-full p-2 md:p-6">
			{/* 좌측 상단 - loud-speaker (전체 화면 기준 고정) */}
			<div className="fixed top-5 left-4 md:top-8 md:left-8 w-12 h-12 md:w-32 md:h-32 animate-wiggle-1 z-10">
				<Image
					src="/loud-speaker.png"
					alt="loud-speaker"
					fill
					className="object-cover opacity-80"
				/>
			</div>

			{/* 우측 상단 - question (전체 화면 기준 고정) */}
			<div className="fixed top-5 right-4 md:top-8 md:right-8 w-10 h-10 md:w-32 md:h-32 animate-wiggle-2 z-10">
				<Image src="/question.png" alt="question" fill className="object-cover opacity-80" />
			</div>

			{/* 라운드 텍스트 (전체 화면 중앙 상단 고정) */}
			<div className="fixed top-8 left-1/2 -translate-x-1/2 md:top-16 z-10">
				<p className="chalk-text text-chalk-white text-xl md:text-3xl text-center">
					라운드 {currentRound} / {totalRounds}
				</p>
			</div>

			<div className="relative w-full max-w-4xl pt-16 md:pt-20">
				<div className="grid grid-cols-4 gap-1 md:gap-2 lg:gap-3">
					{slots?.map((slot, index) => {
						const imagePath = slot.imagePath;
						const isFocused = focusedIndex === index;
						const name = slot.displayText ?? "";

						return (
							<div
								key={index}
								className={`
                    relative aspect-square rounded-md overflow-hidden
                    transition-transform duration-300
                    ${isFocused ? "ring-4 ring-chalk-yellow" : ""}
                  `}
							>
								{imagePath ? (
									<>
										<Image src={imagePath} alt={name} fill className="object-cover" unoptimized />
										{challengeData.show_names && name && (
											<div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 md:p-2">
												<p className="chalk-text text-chalk-yellow text-center text-xs md:text-base font-bold truncate">
													{name}
												</p>
											</div>
										)}
									</>
								) : (
									<div className="flex items-center justify-center h-full">
										<p className="text-chalk-white/50 text-xs">비어있음</p>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default PlayingGameStage;
