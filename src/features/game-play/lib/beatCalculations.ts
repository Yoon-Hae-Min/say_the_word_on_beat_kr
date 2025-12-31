/**
 * Beat Calculation Service
 *
 * Pure mathematical functions for beat synchronization in game play.
 * Extracted from PlayingGameStage component following Single Responsibility Principle.
 *
 * These functions are testable in isolation and can be reused across different
 * game implementations.
 */

/**
 * Calculate which round the game is currently in based on beat number
 *
 * @param beat - Current beat index (0-based)
 * @param roundBeats - Number of beats per round
 * @returns Round number (1-based)
 */
export const calculateRoundFromBeat = (beat: number, roundBeats: number): number => {
	return Math.floor(beat / roundBeats) + 1;
};

/**
 * Calculate block index from beat number
 *
 * @param beat - Current beat index (0-based)
 * @param blockSize - Number of beats per block
 * @returns Block index (0-based)
 */
export const calculateBlockIndex = (beat: number, blockSize: number): number => {
	return Math.floor(beat / blockSize);
};

/**
 * Determine if the current block is active (should highlight slots)
 *
 * Active blocks are odd-numbered blocks (1, 3, 5, ...) in 0-based indexing (indices 1, 3, 5, ...)
 *
 * @param blockIndex - Block index (0-based)
 * @returns true if block is active
 */
export const isActiveBlock = (blockIndex: number): boolean => {
	return blockIndex % 2 === 1;
};

/**
 * Calculate the focused slot index within the current round
 *
 * @param beat - Current beat index (0-based)
 * @param steps - Number of steps (slots) per round
 * @returns Focused slot index (0-based), or null if no slot should be focused
 */
export const calculateFocusedIndex = (beat: number, steps: number): number => {
	return beat % steps;
};

/**
 * Determine if a specific slot should be highlighted at the current beat
 *
 * @param beat - Current beat index (0-based)
 * @param slotIndex - Slot index to check (0-based)
 * @param blockSize - Number of beats per block
 * @param steps - Number of steps (slots) per round
 * @returns true if the slot should be highlighted
 */
export const shouldHighlightSlot = (
	beat: number,
	slotIndex: number,
	blockSize: number,
	steps: number
): boolean => {
	const blockIndex = calculateBlockIndex(beat, blockSize);

	if (!isActiveBlock(blockIndex)) {
		return false;
	}

	const focusedIndex = calculateFocusedIndex(beat, steps);
	return focusedIndex === slotIndex;
};

/**
 * Check if the game has progressed beyond available rounds
 *
 * @param beat - Current beat index (0-based)
 * @param roundBeats - Number of beats per round
 * @param totalRounds - Total number of rounds in the game
 * @returns true if game is complete
 */
export const isGameComplete = (beat: number, roundBeats: number, totalRounds: number): boolean => {
	const currentRound = calculateRoundFromBeat(beat, roundBeats);
	return currentRound > totalRounds;
};
