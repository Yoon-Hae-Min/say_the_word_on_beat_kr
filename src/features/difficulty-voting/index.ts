/**
 * Difficulty Voting Feature
 *
 * Public API exports for the difficulty voting feature.
 */

// Types
export type { DifficultyLevel, VotePercentages } from "@/shared/lib/difficulty";
// API functions (exported for testing or advanced use cases)
export { getUserVote, getVoteStats, submitVote } from "./api/voteService";
export type { UserVote, VoteStats } from "./model/types";
// Main component
export { default as DifficultyVoting } from "./ui/DifficultyVoting";
