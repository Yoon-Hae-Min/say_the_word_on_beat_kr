"use client";

import type { ClientSafeChallenge } from "@/entities/challenge";
import { ChalkButton, DifficultyText } from "@/shared/ui";

interface IdleGameStageProps {
	challengeData: ClientSafeChallenge;
	onStartClick: () => void;
}

const IdleGameStage = ({ challengeData, onStartClick }: IdleGameStageProps) => {
	return (
		<div className="flex items-center justify-center h-full">
			<div className="flex flex-col items-center gap-6">
				<div className="flex flex-col items-center gap-3">
					<DifficultyText
						stats={{
							easy: challengeData.difficulty_easy ?? 0,
							normal: challengeData.difficulty_normal ?? 0,
							hard: challengeData.difficulty_hard ?? 0,
						}}
						className="text-base md:text-lg"
					/>
					<h1 className="chalk-text text-chalk-yellow text-2xl md:text-3xl lg:text-4xl font-bold text-center px-4">
						"{challengeData.title}"
					</h1>
				</div>

				<ChalkButton variant="yellow" onClick={onStartClick} className="px-8 py-4 text-xl">
					시작하기
				</ChalkButton>
			</div>
		</div>
	);
};

export default IdleGameStage;
