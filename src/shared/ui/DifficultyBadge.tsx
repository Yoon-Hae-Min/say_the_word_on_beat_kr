"use client";

import { getDifficultyLabel } from "@/features/difficulty-voting/model/types";
import type { DifficultyStats } from "@/shared/lib/difficulty";
import { calculateDominantDifficulty } from "@/shared/lib/difficulty";

interface DifficultyBadgeProps {
	stats: DifficultyStats;
	size?: "sm" | "md" | "lg";
	className?: string;
}

export default function DifficultyBadge({
	stats,
	size = "sm",
	className = "",
}: DifficultyBadgeProps) {
	const dominant = calculateDominantDifficulty(stats);

	if (!dominant) {
		return (
			<div
				className={`inline-flex items-center gap-1 rounded-full bg-chalk-white px-2 py-1 ${className}`}
			>
				<span className="chalk-text text-xs text-chalkboard-bg font-semibold">난이도 집계 중</span>
			</div>
		);
	}

	const label = getDifficultyLabel(dominant.level);

	// Size variants
	const sizeClasses = {
		sm: "text-xs px-2 py-1",
		md: "text-sm px-3 py-1.5",
		lg: "text-base px-4 py-2",
	};

	// Color variants based on difficulty (matching VoteButtons)
	const colorClasses = {
		easy: "bg-chalk-white text-chalkboard-bg",
		normal: "bg-chalk-blue text-chalkboard-bg",
		hard: "bg-chalk-yellow text-chalkboard-bg",
	};

	return (
		<div
			className={`inline-flex items-center rounded-full ${
				colorClasses[dominant.level]
			} ${sizeClasses[size]} ${className}`}
		>
			<span className="chalk-text font-bold">{label}</span>
		</div>
	);
}
