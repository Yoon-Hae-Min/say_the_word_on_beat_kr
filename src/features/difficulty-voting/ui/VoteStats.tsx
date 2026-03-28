"use client";

import type { DifficultyLevel } from "@/shared/lib/difficulty";
import { calculatePercentages } from "@/shared/lib/difficulty";
import { difficultyConfig } from "../model/difficultyConfig";
import type { VoteStats as VoteStatsType } from "../model/types";

interface VoteStatsProps {
	stats: VoteStatsType;
	currentVote: DifficultyLevel | null;
	showChangeButton?: boolean;
	onChangeVote?: () => void;
	className?: string;
}

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
	const { icon: Icon, label } = difficultyConfig[difficulty];

	return (
		<div
			className={`
				space-y-2 rounded-lg border-2 p-4 transition-all
				${
					isUserVote
						? "border-chalk-yellow/40 bg-chalk-yellow/5"
						: "border-chalk-white/10 bg-chalk-white/5"
				}
			`}
		>
			<div className="flex items-center justify-between">
				<span
					className={`flex items-center gap-2 chalk-text ${isUserVote ? "text-chalk-yellow" : "text-chalk-white"}`}
				>
					<Icon size={18} />
					<span>{label}</span>
					{isUserVote && <span className="text-xs text-chalk-yellow/70">← 내 투표</span>}
				</span>
				<span
					className={`chalk-text text-sm ${
						isUserVote ? "text-chalk-yellow" : "text-chalk-white/60"
					}`}
				>
					{count}표 ({percentage.toFixed(1)}%)
				</span>
			</div>

			<div className="h-2 overflow-hidden rounded-full bg-chalk-white/10">
				<div
					className={`h-full transition-all duration-500 ease-out ${
						isUserVote ? "bg-chalk-yellow" : "bg-chalk-white/40"
					}`}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}

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
		<div className={`space-y-5 ${className}`}>
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
				<div className="flex justify-center">
					<button
						type="button"
						onClick={onChangeVote}
						className="chalk-text text-sm text-chalk-white/50 underline transition-colors hover:text-chalk-white"
					>
						투표 변경하기
					</button>
				</div>
			)}
		</div>
	);
}
