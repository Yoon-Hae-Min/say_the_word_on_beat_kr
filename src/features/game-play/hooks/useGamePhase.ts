/**
 * useGamePhase Hook
 *
 * Custom hook for managing game phase state machine.
 * Extracted from GameStage component.
 *
 * Manages the game flow: idle → countdown → playing → finished
 */

import { useCallback, useState } from "react";

export type GamePhase = "idle" | "countdown" | "playing" | "finished";

export interface UseGamePhaseReturn {
	/**
	 * Current game phase
	 */
	phase: GamePhase;

	/**
	 * Phase transition actions
	 */
	actions: {
		startCountdown: () => void;
		startPlaying: () => void;
		finishGame: () => void;
		resetGame: () => void;
	};

	/**
	 * Phase check helpers
	 */
	is: {
		idle: boolean;
		countdown: boolean;
		playing: boolean;
		finished: boolean;
	};
}

/**
 * Custom hook for game phase state machine
 *
 * @example
 * ```tsx
 * const gamePhase = useGamePhase();
 *
 * if (gamePhase.is.idle) {
 *   return <IdleScreen onStart={gamePhase.actions.startCountdown} />;
 * }
 *
 * if (gamePhase.is.playing) {
 *   return <PlayingScreen onComplete={gamePhase.actions.finishGame} />;
 * }
 * ```
 */
export const useGamePhase = (): UseGamePhaseReturn => {
	const [phase, setPhase] = useState<GamePhase>("idle");

	// Transition to countdown phase
	const startCountdown = useCallback(() => {
		setPhase("countdown");
	}, []);

	// Transition to playing phase
	const startPlaying = useCallback(() => {
		setPhase("playing");
	}, []);

	// Transition to finished phase
	const finishGame = useCallback(() => {
		setPhase("finished");
	}, []);

	// Reset to idle phase
	const resetGame = useCallback(() => {
		setPhase("idle");
	}, []);

	return {
		phase,
		actions: {
			startCountdown,
			startPlaying,
			finishGame,
			resetGame,
		},
		is: {
			idle: phase === "idle",
			countdown: phase === "countdown",
			playing: phase === "playing",
			finished: phase === "finished",
		},
	};
};
