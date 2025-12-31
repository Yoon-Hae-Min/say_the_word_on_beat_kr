/**
 * GameStage Component (Refactored)
 *
 * Main orchestrator for game phases.
 * Refactored to use custom hooks for state machine management.
 *
 * This is the refactored version that will replace the original GameStage.tsx
 */

"use client";

import type { ClientSafeChallenge } from "@/entities/challenge";
import { useGamePhase } from "../hooks/useGamePhase";
import CountDownGameState from "./CountDownGameState";
import FinishedGameScreen from "./FinishedGameScreen";
import GameNavigationBar from "./GameNavigationBar";
import IdleGameStage from "./IdleGameStage";
import PlayingGameStage from "./PlayingGameStage";

interface GameStageProps {
	challengeData: ClientSafeChallenge;
}

export default function GameStage({ challengeData }: GameStageProps) {
	// Use custom hook for game phase management
	const gamePhase = useGamePhase();

	return (
		<>
			{/* Navigation Bar - Fixed across all phases */}
			<GameNavigationBar challengeData={challengeData} />

			{/* Idle 화면 */}
			{gamePhase.is.idle && (
				<IdleGameStage
					challengeData={challengeData}
					onStartClick={gamePhase.actions.startCountdown}
				/>
			)}

			{/* Countdown 화면 */}
			{gamePhase.is.countdown && (
				<CountDownGameState
					onCountdownEnd={gamePhase.actions.startPlaying}
					initialCount={3}
					challengeData={challengeData}
				/>
			)}

			{/* Playing 화면 */}
			{gamePhase.is.playing && (
				<PlayingGameStage
					challengeData={challengeData}
					onPlayingEnd={gamePhase.actions.finishGame}
				/>
			)}

			{/* Finished 화면 */}
			{gamePhase.is.finished && (
				<FinishedGameScreen title={challengeData.title} onRestart={gamePhase.actions.resetGame} />
			)}
		</>
	);
}
