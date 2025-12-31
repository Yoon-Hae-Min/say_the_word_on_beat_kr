/**
 * PlayingGameStage Component (Refactored)
 *
 * Main playing screen for the game.
 * Refactored to use custom hooks and composition of smaller components.
 *
 * This is the refactored version that will replace the original PlayingGameStage.tsx
 */

import type { ClientSafeChallenge } from "@/entities/challenge";
import { useGameBeatController } from "../hooks/useGameBeatController";
import BeatSlotGrid from "./BeatSlotGrid";
import GameDecorations from "./GameDecorations";
import RoundIndicator from "./RoundIndicator";

interface PlayingGameStageProps {
	challengeData: ClientSafeChallenge;
	onPlayingEnd: () => void;
}

const PlayingGameStage = ({ challengeData, onPlayingEnd }: PlayingGameStageProps) => {
	// Use custom hook for beat controller
	const beatController = useGameBeatController({
		challengeData,
		onComplete: onPlayingEnd,
	});

	return (
		<div className="relative flex items-center justify-center h-full p-2 md:p-6">
			{/* Decorative elements */}
			<GameDecorations />

			{/* Round indicator */}
			<RoundIndicator
				currentRound={beatController.currentRound}
				totalRounds={beatController.totalRounds}
			/>

			{/* Beat slot grid */}
			<div className="relative w-full max-w-4xl pt-16 md:pt-20">
				<BeatSlotGrid
					slots={beatController.currentSlots}
					focusedIndex={beatController.focusedIndex}
					showNames={challengeData.show_names}
				/>
			</div>
		</div>
	);
};

export default PlayingGameStage;
