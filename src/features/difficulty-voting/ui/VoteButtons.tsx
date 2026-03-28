"use client";

import type { LucideIcon } from "lucide-react";
import { Flame, Smile, Zap } from "lucide-react";
import type { DifficultyLevel } from "@/shared/lib/difficulty";

interface VoteButtonsProps {
	currentVote: DifficultyLevel | null;
	isSubmitting: boolean;
	onVote: (difficulty: DifficultyLevel) => void;
	className?: string;
}

interface VoteOption {
	difficulty: DifficultyLevel;
	icon: LucideIcon;
	label: string;
	color: string;
	activeColor: string;
}

const voteOptions: VoteOption[] = [
	{
		difficulty: "easy",
		icon: Smile,
		label: "쉬움",
		color:
			"text-chalk-white/60 border-chalk-white/20 hover:border-chalk-white/40 hover:text-chalk-white",
		activeColor: "text-green-400 border-green-400/60 bg-green-400/10",
	},
	{
		difficulty: "normal",
		icon: Zap,
		label: "보통",
		color:
			"text-chalk-white/60 border-chalk-white/20 hover:border-chalk-blue/40 hover:text-chalk-blue",
		activeColor: "text-chalk-blue border-chalk-blue/60 bg-chalk-blue/10",
	},
	{
		difficulty: "hard",
		icon: Flame,
		label: "어려움",
		color:
			"text-chalk-white/60 border-chalk-white/20 hover:border-chalk-yellow/40 hover:text-chalk-yellow",
		activeColor: "text-chalk-yellow border-chalk-yellow/60 bg-chalk-yellow/10",
	},
];

export default function VoteButtons({
	currentVote,
	isSubmitting,
	onVote,
	className = "",
}: VoteButtonsProps) {
	return (
		<div className={`space-y-5 ${className}`}>
			<p className="chalk-text text-center text-lg text-chalk-white">난이도를 투표해주세요</p>

			<div className="flex justify-center gap-4">
				{voteOptions.map(({ difficulty, icon: Icon, label, color, activeColor }) => {
					const isActive = currentVote === difficulty;

					return (
						<button
							key={difficulty}
							type="button"
							onClick={() => onVote(difficulty)}
							disabled={isSubmitting}
							className={`
								flex flex-col items-center gap-2 rounded-lg border-2 px-6 py-4
								transition-all duration-200
								disabled:cursor-not-allowed disabled:opacity-50
								${isActive ? activeColor : color}
							`}
						>
							<Icon size={28} />
							<span className="chalk-text text-sm font-bold">{label}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
