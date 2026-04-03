"use client";

import { Settings2 } from "lucide-react";
import { useState } from "react";
import { ChalkButton, DifficultyText } from "@/shared/ui";
import type { PlaybackSpeed } from "../lib/speedPresets";
import SpeedSelectModal from "./SpeedSelectModal";

interface IdleGameStageProps {
	title: string;
	difficultyEasy: number;
	difficultyNormal: number;
	difficultyHard: number;
	playbackRate: PlaybackSpeed;
	onSpeedChange: (rate: PlaybackSpeed) => void;
	onStartClick: () => void;
}

const IdleGameStage = ({
	title,
	difficultyEasy,
	difficultyNormal,
	difficultyHard,
	playbackRate,
	onSpeedChange,
	onStartClick,
}: IdleGameStageProps) => {
	const [isSpeedModalOpen, setIsSpeedModalOpen] = useState(false);

	return (
		<>
			<div className="flex items-center justify-center h-full">
				<div className="flex flex-col items-center gap-6">
					<div className="flex flex-col items-center gap-3">
						<DifficultyText
							stats={{
								easy: difficultyEasy,
								normal: difficultyNormal,
								hard: difficultyHard,
							}}
							className="text-base md:text-lg"
						/>
						<h1 className="chalk-text text-chalk-yellow text-2xl md:text-3xl lg:text-4xl font-bold text-center px-4">
							"{title}"
						</h1>
					</div>

					{/* 속도 선택 진입점 */}
					<button
						type="button"
						onClick={() => setIsSpeedModalOpen(true)}
						className="flex items-center gap-2 rounded-full border-2 border-chalk-white/30 px-4 py-2 text-chalk-white/70 transition-all hover:border-chalk-yellow/50 hover:text-chalk-yellow"
					>
						<Settings2 size={16} />
						<span className="chalk-text text-sm">속도</span>
						<span className="chalk-text text-sm font-bold text-chalk-yellow">{playbackRate}x</span>
					</button>

					<ChalkButton variant="yellow" onClick={onStartClick} className="px-8 py-4 text-xl">
						시작하기
					</ChalkButton>
				</div>
			</div>

			<SpeedSelectModal
				isOpen={isSpeedModalOpen}
				playbackRate={playbackRate}
				onSpeedChange={onSpeedChange}
				onStart={() => {
					setIsSpeedModalOpen(false);
				}}
				onClose={() => setIsSpeedModalOpen(false)}
			/>
		</>
	);
};

export default IdleGameStage;
