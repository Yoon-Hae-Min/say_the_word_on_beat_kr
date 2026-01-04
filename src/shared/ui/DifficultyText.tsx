"use client";

import { getDifficultyLabel } from "@/features/difficulty-voting/model/types";
import type { DifficultyStats } from "@/shared/lib/difficulty";
import { calculateDominantDifficulty } from "@/shared/lib/difficulty";

interface DifficultyTextProps {
	stats: DifficultyStats;
	className?: string;
}

export default function DifficultyText({ stats, className = "" }: DifficultyTextProps) {
	const dominant = calculateDominantDifficulty(stats);

	// Determine size classes based on className
	const isLarge = className.includes("text-base") || className.includes("text-lg");
	const dotSize = isLarge ? "text-sm" : "text-[10px]";
	const textSize = isLarge ? "" : "text-xs"; // If large, let className control it

	if (!dominant) {
		return (
			<div className={`flex items-center gap-1 ${className}`}>
				<span className={`text-chalk-white/40 ${dotSize}`}>●</span>
				<span className={`chalk-text text-chalk-white/60 ${textSize}`}>난이도 집계 중</span>
			</div>
		);
	}

	const label = getDifficultyLabel(dominant.level);

	// Color variants based on difficulty (matching VoteButtons)
	const dotColorClasses = {
		easy: "text-chalk-white",
		normal: "text-chalk-blue",
		hard: "text-chalk-yellow",
	};

	const textColorClasses = {
		easy: "text-chalk-white",
		normal: "text-chalk-blue",
		hard: "text-chalk-yellow",
	};

	return (
		<div className={`flex items-center gap-1.5`}>
			<span className={`${dotColorClasses[dominant.level]} ${dotSize}`}>●</span>
			<span className={`chalk-text ${textColorClasses[dominant.level]} ${textSize} ${className} font-semibold`}>
				{label}
			</span>
		</div>
	);
}
