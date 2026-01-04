"use client";

import type { DifficultyLevel } from "@/features/difficulty-voting/model/types";
import { calculatePercentages, getDifficultyLabel } from "@/features/difficulty-voting/model/types";
import type { DifficultyStats } from "@/shared/lib/difficulty";
import { calculateDominantDifficulty } from "@/shared/lib/difficulty";

interface DifficultyDisplayProps {
	stats: DifficultyStats;
	className?: string;
}

export default function DifficultyDisplay({ stats, className = "" }: DifficultyDisplayProps) {
	const dominant = calculateDominantDifficulty(stats);

	if (!dominant) {
		return (
			<div className={`text-center ${className}`}>
				<p className="chalk-text text-chalk-white/60 text-sm">아직 난이도 투표가 없습니다</p>
			</div>
		);
	}

	const label = getDifficultyLabel(dominant.level);
	const percentages = calculatePercentages({
		easy: stats.easy,
		normal: stats.normal,
		hard: stats.hard,
		total: dominant.total,
	});

	const difficulties: DifficultyLevel[] = ["easy", "normal", "hard"];

	// Color variants based on difficulty (matching VoteButtons)
	const colorClasses = {
		easy: "bg-chalk-white text-chalkboard-bg",
		normal: "bg-chalk-blue text-chalkboard-bg",
		hard: "bg-chalk-yellow text-chalkboard-bg",
	};

	return (
		<div className={`space-y-4 ${className}`}>
			{/* Large Badge */}
			<div className="flex justify-center">
				<div
					className={`inline-flex items-center rounded-2xl px-8 py-4 shadow-lg ${colorClasses[dominant.level]}`}
				>
					<span className="chalk-text text-2xl font-bold">{label}</span>
				</div>
			</div>

			{/* Vote Distribution */}
			<div className="text-center">
				<p className="chalk-text text-sm text-chalk-white/80 mb-2">총 {dominant.total}표</p>
				<div className="flex justify-center gap-2 text-xs">
					{difficulties.map((diff) => {
						const diffLabel = getDifficultyLabel(diff);
						const percent = percentages[diff];
						const isActive = diff === dominant.level;

						return (
							<span
								key={diff}
								className={`chalk-text ${isActive ? "text-chalk-yellow" : "text-chalk-white/60"}`}
							>
								{diffLabel} {percent.toFixed(0)}%
							</span>
						);
					})}
				</div>
			</div>
		</div>
	);
}
