/**
 * Difficulty Voting Feature
 *
 * Public API exports for the difficulty voting feature.
 */

// API functions (exported for testing or advanced use cases)
export { getUserVote, getVoteStats, submitVote } from "./api/voteService";

// Types
export type { DifficultyLevel, UserVote, VotePercentages, VoteStats } from "./model/types";
// Main component
export { default as DifficultyVoting } from "./ui/DifficultyVoting";
