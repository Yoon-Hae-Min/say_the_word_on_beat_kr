/**
 * Difficulty Voting Feature-Specific Type Definitions
 *
 * Based on database schema:
 * - difficulty_votes table (id, challenge_id, fingerprint, difficulty_level, created_at)
 * - challenges table (difficulty_easy, difficulty_normal, difficulty_hard)
 */

import type { DifficultyLevel } from "@/shared/lib/difficulty";

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
