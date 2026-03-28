"use client";

import type { DifficultyLevel } from "@/shared/lib/difficulty";
import { difficultyConfig } from "../model/difficultyConfig";

interface VoteButtonsProps {
	currentVote: DifficultyLevel | null;
	isSubmitting: boolean;
	onVote: (difficulty: DifficultyLevel) => void;
	className?: string;
}

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
				{(
					Object.entries(difficultyConfig) as [DifficultyLevel, typeof difficultyConfig.easy][]
				).map(([difficulty, { icon: Icon, label, color, activeColor }]) => {
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
									disabled:hover:border-chalk-white/20 disabled:hover:text-chalk-white/60
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
