"use client";

import { DatabaseChallenge } from "@/entities/challenge";
import { ChalkButton } from "@/shared/ui";

interface IdleGameStageProps {
	challengeData: DatabaseChallenge;
	onStartClick: () => void;
}

const IdleGameStage = ({ challengeData, onStartClick }: IdleGameStageProps) => {
	return (
		<div className="flex items-center justify-center h-full">
			<div className="flex flex-col items-center gap-6">
				<h1 className="chalk-text text-chalk-yellow text-2xl md:text-3xl lg:text-4xl font-bold text-center px-4">
					"{challengeData.title}"
				</h1>

				<ChalkButton
					variant="yellow"
					onClick={onStartClick}
					className="px-8 py-4 text-xl"
				>
					시작하기
				</ChalkButton>
			</div>
		</div>
	);
};

export default IdleGameStage;
