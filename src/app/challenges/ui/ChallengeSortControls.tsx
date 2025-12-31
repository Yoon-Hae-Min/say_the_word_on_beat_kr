/**
 * ChallengeSortControls Component
 *
 * Sort button group for challenges page.
 * Extracted from ChallengesPage to follow Single Responsibility Principle.
 */

import type { ChallengeSortBy } from "@/entities/challenge";
import { ChalkButton } from "@/shared/ui";

interface ChallengeSortControlsProps {
	/**
	 * Current sort order
	 */
	sortBy: ChallengeSortBy;

	/**
	 * Callback when sort order changes
	 */
	onSortChange: (sort: ChallengeSortBy) => void;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Sort controls for challenge list
 *
 * @example
 * ```tsx
 * <ChallengeSortControls
 *   sortBy={sortBy}
 *   onSortChange={handleSortChange}
 * />
 * ```
 */
export default function ChallengeSortControls({
	sortBy,
	onSortChange,
	className = "",
}: ChallengeSortControlsProps) {
	return (
		<div className={`flex justify-center gap-3 ${className}`}>
			<ChalkButton
				variant={sortBy === "latest" ? "yellow" : "white"}
				onClick={() => onSortChange("latest")}
				className="px-6 py-2 text-base md:text-lg"
			>
				최신순
			</ChalkButton>
			<ChalkButton
				variant={sortBy === "views" ? "yellow" : "white"}
				onClick={() => onSortChange("views")}
				className="px-6 py-2 text-base md:text-lg"
			>
				조회순
			</ChalkButton>
		</div>
	);
}
