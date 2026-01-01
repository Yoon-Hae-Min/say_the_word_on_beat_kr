/**
 * Difficulty Voting Type Definitions
 *
 * Based on database schema:
 * - difficulty_votes table (id, challenge_id, fingerprint, difficulty_level, created_at)
 * - challenges table (difficulty_easy, difficulty_normal, difficulty_hard)
 */

/**
 * Difficulty level options matching database CHECK constraint
 */
export type DifficultyLevel = "easy" | "normal" | "hard";

/**
 * User's current vote for a challenge
 */
export interface UserVote {
	difficultyLevel: DifficultyLevel;
	createdAt: string;
}

/**
 * Aggregated vote statistics for a challenge
 */
export interface VoteStats {
	easy: number;
	normal: number;
	hard: number;
	total: number;
}

/**
 * Vote percentages for display
 */
export interface VotePercentages {
	easy: number;
	normal: number;
	hard: number;
}

/**
 * Calculate percentage distribution of votes
 *
 * @param stats - Vote statistics
 * @returns Percentages for each difficulty level (0-100)
 *
 * @example
 * ```typescript
 * const stats = { easy: 10, normal: 20, hard: 5, total: 35 };
 * const percentages = calculatePercentages(stats);
 * // { easy: 28.57, normal: 57.14, hard: 14.29 }
 * ```
 */
export function calculatePercentages(stats: VoteStats): VotePercentages {
	if (stats.total === 0) {
		return { easy: 0, normal: 0, hard: 0 };
	}

	return {
		easy: (stats.easy / stats.total) * 100,
		normal: (stats.normal / stats.total) * 100,
		hard: (stats.hard / stats.total) * 100,
	};
}

/**
 * Type guard to check if a string is a valid DifficultyLevel
 */
export function isDifficultyLevel(value: string): value is DifficultyLevel {
	return value === "easy" || value === "normal" || value === "hard";
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
