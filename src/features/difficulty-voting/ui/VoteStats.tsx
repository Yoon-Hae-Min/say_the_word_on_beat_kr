/**
 * VoteStats Component
 *
 * Displays voting statistics with horizontal bar charts.
 * Highlights the current user's vote.
 */

"use client";

import { ChalkButton } from "@/shared/ui";
import type { DifficultyLevel, VoteStats as VoteStatsType } from "../model/types";
import { calculatePercentages, getDifficultyEmoji, getDifficultyLabel } from "../model/types";

interface VoteStatsProps {
	/**
	 * Vote statistics
	 */
	stats: VoteStatsType;

	/**
	 * User's current vote (to highlight)
	 */
	currentVote: DifficultyLevel | null;

	/**
	 * Show change vote button
	 */
	showChangeButton?: boolean;

	/**
	 * Callback when user wants to change their vote
	 */
	onChangeVote?: () => void;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Single bar in the vote statistics
 */
function VoteBar({
	difficulty,
	count,
	percentage,
	isUserVote,
}: {
	difficulty: DifficultyLevel;
	count: number;
	percentage: number;
	isUserVote: boolean;
}) {
	const emoji = getDifficultyEmoji(difficulty);
	const label = getDifficultyLabel(difficulty);

	return (
		<div
			className={`
				space-y-2 rounded-lg border-2 p-4 transition-all
				${
					isUserVote
						? "border-chalk-yellow bg-chalk-yellow/10"
						: "border-chalk-white/20 bg-chalkboard-bg/10"
				}
			`}
		>
			<div className="flex items-center justify-between">
				<span className={`chalk-text ${isUserVote ? "text-chalk-yellow" : "text-chalk-white"}`}>
					<span className="text-lg">{emoji}</span>
					<span className="ml-2">{label}</span>
					{isUserVote && <span className="ml-2 text-xs">← 내 투표</span>}
				</span>
				<span
					className={`chalk-text text-sm ${
						isUserVote ? "text-chalk-yellow" : "text-chalk-white/80"
					}`}
				>
					{count}표 ({percentage.toFixed(1)}%)
				</span>
			</div>

			<div className="h-2 overflow-hidden rounded-full bg-chalkboard-bg/30">
				<div
					className={`h-full transition-all duration-500 ease-out ${
						isUserVote ? "bg-chalk-yellow" : "bg-chalk-white/60"
					}`}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}

/**
 * Vote statistics display with bar charts
 *
 * @example
 * ```tsx
 * <VoteStats
 *   stats={{ easy: 10, normal: 25, hard: 5, total: 40 }}
 *   currentVote="normal"
 *   showChangeButton={true}
 *   onChangeVote={() => setShowButtons(true)}
 * />
 * ```
 */
export default function VoteStats({
	stats,
	currentVote,
	showChangeButton = true,
	onChangeVote,
	className = "",
}: VoteStatsProps) {
	const percentages = calculatePercentages(stats);

	const difficulties: DifficultyLevel[] = ["easy", "normal", "hard"];

	return (
		<div className={`space-y-6 ${className}`}>
			{stats.total === 0 ? (
				<p className="chalk-text text-center text-sm text-chalk-white/50">아직 투표가 없습니다</p>
			) : (
				<div className="space-y-3">
					{difficulties.map((difficulty) => (
						<VoteBar
							key={difficulty}
							difficulty={difficulty}
							count={stats[difficulty]}
							percentage={percentages[difficulty]}
							isUserVote={currentVote === difficulty}
						/>
					))}
				</div>
			)}

			{showChangeButton && onChangeVote && (
				<div className="mt-4 flex justify-center">
					<ChalkButton variant="white-outline" onClick={onChangeVote} className="px-6 py-2 text-sm">
						투표 변경하기
					</ChalkButton>
				</div>
			)}
		</div>
	);
}
