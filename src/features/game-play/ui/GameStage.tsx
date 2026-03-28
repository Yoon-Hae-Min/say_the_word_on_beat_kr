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
import { DifficultyVoting } from "@/features/difficulty-voting";
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
			{/* Navigation Bar - Hidden on finished screen */}
			{!gamePhase.is.finished && (
				<GameNavigationBar
					challengeId={challengeData.id}
					title={challengeData.title}
					isPublic={challengeData.is_public}
					isMine={challengeData.isMine}
				/>
			)}

			{/* Idle 화면 */}
			{gamePhase.is.idle && (
				<IdleGameStage
					title={challengeData.title}
					difficultyEasy={challengeData.difficulty_easy ?? 0}
					difficultyNormal={challengeData.difficulty_normal ?? 0}
					difficultyHard={challengeData.difficulty_hard ?? 0}
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
				<FinishedGameScreen
					title={challengeData.title}
					challengeId={challengeData.id}
					challengeData={challengeData}
					onRestart={gamePhase.actions.resetGame}
					votingSlot={<DifficultyVoting challengeId={challengeData.id} />}
				/>
			)}
		</>
	);
}
