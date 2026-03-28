"use client";

import { ChalkButton, DifficultyText } from "@/shared/ui";

interface IdleGameStageProps {
	title: string;
	difficultyEasy: number;
	difficultyNormal: number;
	difficultyHard: number;
	onStartClick: () => void;
}

const IdleGameStage = ({
	title,
	difficultyEasy,
	difficultyNormal,
	difficultyHard,
	onStartClick,
}: IdleGameStageProps) => {
	return (
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

				<ChalkButton variant="yellow" onClick={onStartClick} className="px-8 py-4 text-xl">
					시작하기
				</ChalkButton>
			</div>
		</div>
	);
};

export default IdleGameStage;
