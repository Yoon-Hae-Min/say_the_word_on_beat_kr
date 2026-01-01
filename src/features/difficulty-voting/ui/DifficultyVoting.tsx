/**
 * DifficultyVoting Component
 *
 * Main container for difficulty voting feature.
 * Manages state, loads user's existing vote, and handles vote submission.
 */

"use client";

import { useEffect, useState } from "react";
import { getUserId } from "@/shared/lib/user/fingerprint";
import { getUserVote, getVoteStats, submitVote } from "../api/voteService";
import type { DifficultyLevel, VoteStats } from "../model/types";
import VoteButtons from "./VoteButtons";
import VoteStatsDisplay from "./VoteStats";

/**
 * Voting state machine
 */
type VotingState = "loading" | "idle" | "submitting" | "voted" | "error";

interface DifficultyVotingProps {
	/**
	 * Challenge ID to vote on
	 */
	challengeId: string;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Custom hook for difficulty voting logic
 */
function useDifficultyVoting(challengeId: string) {
	const [state, setState] = useState<VotingState>("loading");
	const [currentVote, setCurrentVote] = useState<DifficultyLevel | null>(null);
	const [stats, setStats] = useState<VoteStats>({ easy: 0, normal: 0, hard: 0, total: 0 });
	const [error, setError] = useState<string | null>(null);
	const [showStats, setShowStats] = useState(false);

	// Load user's existing vote on mount
	useEffect(() => {
		const loadVote = async () => {
			try {
				setState("loading");
				const fingerprint = getUserId();

				if (!fingerprint) {
					setState("idle");
					return;
				}

				const existingVote = await getUserVote({ challengeId, fingerprint });

				if (existingVote) {
					setCurrentVote(existingVote.difficultyLevel);
					const voteStats = await getVoteStats(challengeId);
					setStats(voteStats);
					setShowStats(true);
					setState("voted");
				} else {
					setState("idle");
				}
			} catch (err) {
				console.error("Error loading vote:", err);
				setState("error");
				setError("투표를 불러오는 중 오류가 발생했습니다");
			}
		};

		loadVote();
	}, [challengeId]);

	// Submit vote function
	const handleVote = async (difficulty: DifficultyLevel) => {
		try {
			setState("submitting");
			setError(null);

			const fingerprint = getUserId();
			if (!fingerprint) {
				throw new Error("사용자 식별 정보를 가져올 수 없습니다");
			}

			// Optimistic update
			const previousVote = currentVote;
			setCurrentVote(difficulty);

			// Submit to server
			const result = await submitVote({
				challengeId,
				fingerprint,
				difficultyLevel: difficulty,
			});

			if (!result.success) {
				// Revert on error
				setCurrentVote(previousVote);
				setState(previousVote ? "voted" : "idle");
				setError(result.error ?? "투표 중 오류가 발생했습니다");
				return;
			}

			// Fetch updated stats
			const updatedStats = await getVoteStats(challengeId);
			setStats(updatedStats);
			setShowStats(true);
			setState("voted");
		} catch (err) {
			console.error("Error submitting vote:", err);
			setState("error");
			setError("네트워크 오류가 발생했습니다");
		}
	};

	// Toggle between voting and stats view
	const handleChangeVote = () => {
		setShowStats(false);
	};

	const handleBackToStats = () => {
		setShowStats(true);
	};

	return {
		state,
		currentVote,
		stats,
		error,
		showStats,
		handleVote,
		handleChangeVote,
		handleBackToStats,
	};
}

/**
 * Difficulty voting container component
 *
 * Displays voting buttons initially, then shows statistics after voting.
 * Allows users to change their vote.
 *
 * @example
 * ```tsx
 * <DifficultyVoting challengeId="abc-123" />
 * ```
 */
export default function DifficultyVoting({ challengeId, className = "" }: DifficultyVotingProps) {
	const {
		state,
		currentVote,
		stats,
		error,
		showStats,
		handleVote,
		handleChangeVote,
		handleBackToStats,
	} = useDifficultyVoting(challengeId);

	// Loading state
	if (state === "loading") {
		return (
			<div className={`text-center ${className}`}>
				<p className="chalk-text text-chalk-white/50">투표 정보를 불러오는 중...</p>
			</div>
		);
	}

	// Error state with retry
	if (state === "error" && error) {
		return (
			<div className={`space-y-2 text-center ${className}`}>
				<p className="chalk-text text-red-400">{error}</p>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="chalk-text text-sm text-chalk-white/70 underline hover:text-chalk-white"
				>
					다시 시도
				</button>
			</div>
		);
	}

	// Show stats if user has voted and showStats is true
	if (state === "voted" && showStats) {
		return (
			<VoteStatsDisplay
				stats={stats}
				currentVote={currentVote}
				showChangeButton={true}
				onChangeVote={handleChangeVote}
				className={className}
			/>
		);
	}

	// Show voting buttons (idle or after clicking "change vote")
	return (
		<div className={`space-y-3 ${className}`}>
			<VoteButtons
				currentVote={currentVote}
				isSubmitting={state === "submitting"}
				onVote={handleVote}
			/>

			{error && <p className="chalk-text text-center text-sm text-red-400">{error}</p>}

			{/* Show "back to stats" button if user had voted before */}
			{currentVote && !showStats && (
				<div className="flex justify-center">
					<button
						type="button"
						onClick={handleBackToStats}
						className="chalk-text text-sm text-chalk-white/70 underline hover:text-chalk-white"
					>
						통계 다시 보기
					</button>
				</div>
			)}
		</div>
	);
}
