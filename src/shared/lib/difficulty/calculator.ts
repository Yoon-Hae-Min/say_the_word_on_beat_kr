/**
 * Difficulty Calculation Utilities
 */

import type { DifficultyStats, DominantDifficulty } from "./types";

/**
 * Calculate the dominant difficulty level based on vote counts
 * Returns the difficulty level with the most votes
 *
 * @param stats - Vote counts for each difficulty level
 * @returns Dominant difficulty info, or null if no votes exist
 *
 * Tie-breaking priority: normal > easy > hard
 *
 * @example
 * ```typescript
 * const stats = { easy: 10, normal: 5, hard: 3 };
 * const result = calculateDominantDifficulty(stats);
 * // { level: "easy", count: 10, total: 18 }
 * ```
 */
export function calculateDominantDifficulty(stats: DifficultyStats): DominantDifficulty | null {
	const total = stats.easy + stats.normal + stats.hard;

	// Return null if no votes
	if (total === 0) {
		return null;
	}

	// Find max votes
	const max = Math.max(stats.easy, stats.normal, stats.hard);

	// Determine level (if tie, prioritize: normal > easy > hard)
	let level: "easy" | "normal" | "hard";
	if (stats.normal === max) {
		level = "normal";
	} else if (stats.easy === max) {
		level = "easy";
	} else {
		level = "hard";
	}

	return {
		level,
		count: max,
		total,
	};
}
