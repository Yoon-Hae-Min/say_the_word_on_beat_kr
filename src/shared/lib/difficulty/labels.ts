/**
 * Difficulty Label & Utility Functions
 *
 * Generic difficulty-related utilities shared across the application.
 */

import type { DifficultyStats } from "./types";

/**
 * Difficulty level options matching database CHECK constraint
 */
export type DifficultyLevel = "easy" | "normal" | "hard";

/**
 * Vote percentages for display
 */
export interface VotePercentages {
	easy: number;
	normal: number;
	hard: number;
}

/**
 * Get display label for difficulty level
 */
export function getDifficultyLabel(level: DifficultyLevel): string {
	const labels: Record<DifficultyLevel, string> = {
		easy: "쉬움",
		normal: "보통",
		hard: "어려움",
	};
	return labels[level];
}

/**
 * Get emoji for difficulty level
 */
export function getDifficultyEmoji(level: DifficultyLevel): string {
	const emojis: Record<DifficultyLevel, string> = {
		easy: "😊",
		normal: "😐",
		hard: "😰",
	};
	return emojis[level];
}

/**
 * Calculate percentage distribution of votes
 *
 * @param stats - Vote counts for each difficulty level
 * @returns Percentages for each difficulty level (0-100)
 *
 * @example
 * ```typescript
 * const stats = { easy: 10, normal: 20, hard: 5 };
 * const percentages = calculatePercentages(stats);
 * // { easy: 28.57, normal: 57.14, hard: 14.29 }
 * ```
 */
export function calculatePercentages(stats: DifficultyStats): VotePercentages {
	const total = stats.easy + stats.normal + stats.hard;

	if (total === 0) {
		return { easy: 0, normal: 0, hard: 0 };
	}

	return {
		easy: (stats.easy / total) * 100,
		normal: (stats.normal / total) * 100,
		hard: (stats.hard / total) * 100,
	};
}

/**
 * Type guard to check if a string is a valid DifficultyLevel
 */
export function isDifficultyLevel(value: string): value is DifficultyLevel {
	return value === "easy" || value === "normal" || value === "hard";
}
