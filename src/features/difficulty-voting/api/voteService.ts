/**
 * Difficulty Voting Service
 *
 * Handles all voting operations using Supabase client-side operations.
 * Uses existing RLS policies - no API routes needed.
 */

import { supabase } from "@/shared/api/supabase/client";
import type { DifficultyLevel, UserVote, VoteStats } from "../model/types";

/**
 * Submit or update a difficulty vote
 *
 * Uses upsert with unique constraint (challenge_id, fingerprint)
 * to automatically handle new votes vs. vote changes.
 *
 * @param params - Vote submission parameters
 * @returns Result object with success status and optional error message
 *
 * @example
 * ```typescript
 * const result = await submitVote({
 *   challengeId: "abc-123",
 *   fingerprint: "fp_xyz",
 *   difficultyLevel: "normal"
 * });
 * if (result.success) {
 *   // Vote submitted successfully
 * }
 * ```
 */
export async function submitVote(params: {
	challengeId: string;
	fingerprint: string;
	difficultyLevel: DifficultyLevel;
}): Promise<{ success: boolean; error?: string }> {
	try {
		const { error } = await supabase.from("difficulty_votes").upsert(
			{
				challenge_id: params.challengeId,
				fingerprint: params.fingerprint,
				difficulty_level: params.difficultyLevel,
			},
			{
				onConflict: "challenge_id,fingerprint",
			}
		);

		if (error) {
			console.error("Vote submission error:", error);
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (err) {
		console.error("Unexpected error during vote submission:", err);
		return { success: false, error: "네트워크 오류가 발생했습니다" };
	}
}

/**
 * Get user's current vote for a challenge
 *
 * @param params - Challenge ID and user fingerprint
 * @returns User's vote or null if they haven't voted
 *
 * @example
 * ```typescript
 * const vote = await getUserVote({
 *   challengeId: "abc-123",
 *   fingerprint: "fp_xyz"
 * });
 * if (vote) {
 *   console.log(`User voted: ${vote.difficultyLevel}`);
 * }
 * ```
 */
export async function getUserVote(params: {
	challengeId: string;
	fingerprint: string;
}): Promise<UserVote | null> {
	try {
		const { data, error } = await supabase
			.from("difficulty_votes")
			.select("difficulty_level, created_at")
			.eq("challenge_id", params.challengeId)
			.eq("fingerprint", params.fingerprint)
			.maybeSingle();

		if (error) {
			console.error("Error fetching user vote:", error);
			return null;
		}

		if (!data) {
			return null;
		}

		return {
			difficultyLevel: data.difficulty_level as DifficultyLevel,
			createdAt: data.created_at ?? new Date().toISOString(),
		};
	} catch (err) {
		console.error("Unexpected error fetching user vote:", err);
		return null;
	}
}

/**
 * Get aggregated vote statistics for a challenge
 *
 * Fetches vote counts from the challenges table
 * (auto-updated by database trigger).
 *
 * @param challengeId - Challenge ID
 * @returns Vote statistics with counts and total
 *
 * @example
 * ```typescript
 * const stats = await getVoteStats("abc-123");
 * console.log(`Total votes: ${stats.total}`);
 * console.log(`Easy: ${stats.easy}, Normal: ${stats.normal}, Hard: ${stats.hard}`);
 * ```
 */
export async function getVoteStats(challengeId: string): Promise<VoteStats> {
	try {
		const { data, error } = await supabase
			.from("challenges")
			.select("difficulty_easy, difficulty_hard, difficulty_normal")
			.eq("id", challengeId)
			.single();

		if (error || !data) {
			console.error("Error fetching vote stats:", error);
			return { easy: 0, normal: 0, hard: 0, total: 0 };
		}

		const easy = data.difficulty_easy ?? 0;
		const normal = data.difficulty_normal ?? 0;
		const hard = data.difficulty_hard ?? 0;

		return {
			easy,
			normal,
			hard,
			total: easy + normal + hard,
		};
	} catch (err) {
		console.error("Unexpected error fetching vote stats:", err);
		return { easy: 0, normal: 0, hard: 0, total: 0 };
	}
}
