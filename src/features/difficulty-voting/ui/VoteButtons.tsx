/**
 * VoteButtons Component
 *
 * Displays 3 horizontal difficulty voting buttons using ChalkButton.
 * Shows active state for current vote and disabled state during submission.
 */

"use client";

import { ChalkButton } from "@/shared/ui";
import type { DifficultyLevel } from "../model/types";
import { getDifficultyEmoji, getDifficultyLabel } from "../model/types";

interface VoteButtonsProps {
	/**
	 * Current user's vote (if any)
	 */
	currentVote: DifficultyLevel | null;

	/**
	 * Whether voting is in progress
	 */
	isSubmitting: boolean;

	/**
	 * Callback when user clicks a difficulty button
	 */
	onVote: (difficulty: DifficultyLevel) => void;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Voting buttons for difficulty selection
 *
 * @example
 * ```tsx
 * <VoteButtons
 *   currentVote="normal"
 *   isSubmitting={false}
 *   onVote={(difficulty) => handleVote(difficulty)}
 * />
 * ```
 */
export default function VoteButtons({
	currentVote,
	isSubmitting,
	onVote,
	className = "",
}: VoteButtonsProps) {
	const buttons: Array<{
		difficulty: DifficultyLevel;
		variant: "white" | "blue" | "yellow";
	}> = [
		{ difficulty: "easy", variant: "white" },
		{ difficulty: "normal", variant: "blue" },
		{ difficulty: "hard", variant: "yellow" },
	];

	return (
		<div className={`space-y-6 ${className}`}>
			<p className="chalk-text text-center text-lg text-chalk-white">
				이 챌린지의 난이도는 어땠나요?
			</p>

			<div className="flex flex-col gap-3 md:flex-row md:gap-4">
				{buttons.map(({ difficulty, variant }) => {
					const isActive = currentVote === difficulty;
					const emoji = getDifficultyEmoji(difficulty);
					const label = getDifficultyLabel(difficulty);

					return (
						<ChalkButton
							key={difficulty}
							variant={variant}
							onClick={() => onVote(difficulty)}
							disabled={isSubmitting}
							className={`
								flex-1 px-6 py-4 text-base transition-all
								${isActive ? "ring-2 ring-offset-2 ring-offset-chalkboard-bg brightness-110" : ""}
								${isSubmitting ? "cursor-not-allowed opacity-50" : ""}
							`}
						>
							<span className="text-xl">{emoji}</span>
							<span className="ml-2">{label}</span>
						</ChalkButton>
					);
				})}
			</div>
		</div>
	);
}
