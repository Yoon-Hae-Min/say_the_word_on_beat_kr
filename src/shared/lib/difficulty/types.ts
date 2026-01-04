/**
 * Difficulty Statistics Type Definitions
 */

export interface DifficultyStats {
	easy: number;
	normal: number;
	hard: number;
}

export interface DominantDifficulty {
	level: "easy" | "normal" | "hard";
	count: number;
	total: number;
}
