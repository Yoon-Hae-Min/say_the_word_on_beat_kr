/**
 * useGameBeatController Hook
 *
 * Custom hook for orchestrating game beat synchronization with game state.
 * Extracted from PlayingGameStage component.
 *
 * Integrates audio beat detection with visual game state (focused slot, current round).
 */

import { useState } from "react";
import type { ClientSafeChallenge } from "@/entities/challenge";
import type { BeatSlot } from "@/entities/challenge/model/types";
import {
	calculateBlockIndex,
	calculateFocusedIndex,
	calculateRoundFromBeat,
	isActiveBlock,
	isGameComplete,
} from "../lib/beatCalculations";
import { useAudioBeat } from "./useAudioBeat";

// Game constants
const BPM = 182;
const BLOCK_SIZE = 8;
const STEPS = 8;
const ROUND_BEATS = 16;

export interface UseGameBeatControllerOptions {
	/**
	 * Challenge data containing game configuration
	 */
	challengeData: ClientSafeChallenge;

	/**
	 * Beats per minute
	 * @default 182
	 */
	bpm?: number;

	/**
	 * Offset in seconds to shift beat detection earlier
	 * @default 0.03
	 */
	offsetSec?: number;

	/**
	 * Callback when game is complete
	 */
	onComplete: () => void;
}

export interface UseGameBeatControllerReturn {
	/**
	 * Index of currently focused slot (0-based), or null if no slot is focused
	 */
	focusedIndex: number | null;

	/**
	 * Current round number (1-based)
	 */
	currentRound: number;

	/**
	 * Slots for the current round
	 */
	currentSlots: BeatSlot[];

	/**
	 * Total number of rounds
	 */
	totalRounds: number;
}

/**
 * Custom hook for game beat controller
 *
 * Orchestrates audio beat with game state, managing focused slot and round progression.
 *
 * @example
 * ```tsx
 * const beatController = useGameBeatController({
 *   challengeData,
 *   onComplete: () => setGamePhase('finished'),
 * });
 *
 * return (
 *   <div>
 *     <p>Round {beatController.currentRound} / {beatController.totalRounds}</p>
 *     {beatController.currentSlots.map((slot, index) => (
 *       <Slot
 *         key={index}
 *         isFocused={beatController.focusedIndex === index}
 *         {...slot}
 *       />
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useGameBeatController = ({
	challengeData,
	bpm = BPM,
	offsetSec = 0.03,
	onComplete,
}: UseGameBeatControllerOptions): UseGameBeatControllerReturn => {
	const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
	const [currentRound, setCurrentRound] = useState(1);

	const totalRounds = challengeData.game_config?.length ?? 0;
	const currentSlots = challengeData.game_config?.[currentRound - 1]?.slots ?? [];

	// Handle beat events from audio
	const handleBeat = (beat: number) => {
		console.log(beat);
		// Check if game is complete
		if (isGameComplete(beat, ROUND_BEATS, totalRounds)) {
			setFocusedIndex(null);
			return;
		}

		// Calculate current round
		const round = calculateRoundFromBeat(beat, ROUND_BEATS);
		setCurrentRound(round);

		// Calculate block and check if it's active
		const blockIndex = calculateBlockIndex(beat, BLOCK_SIZE);
		const shouldHighlight = isActiveBlock(blockIndex);

		if (!shouldHighlight) {
			setFocusedIndex(null);
		} else {
			const focusedSlotIndex = calculateFocusedIndex(beat, STEPS);
			setFocusedIndex(focusedSlotIndex);
		}
	};

	// Use audio beat hook
	useAudioBeat({
		src: "/song.mp3",
		bpm,
		offsetSec,
		onBeat: handleBeat,
		onBeatEnd: onComplete,
	});

	return {
		focusedIndex,
		currentRound,
		currentSlots,
		totalRounds,
	};
};
