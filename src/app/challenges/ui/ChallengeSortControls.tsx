/**
 * ChallengeSortControls Component
 *
 * Dropdown-based filter and sort controls for challenges page.
 * Provides a compact, mobile-friendly interface using select dropdowns.
 */

import type { ChallengeFilter, ChallengeSortBy } from "@/entities/challenge";
import { ChalkSelect } from "@/shared/ui";

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
	 * Current filter option
	 */
	filter: ChallengeFilter;

	/**
	 * Callback when filter changes
	 */
	onFilterChange: (filter: ChallengeFilter) => void;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

// Filter options
const FILTER_OPTIONS = [
	{ value: "all", label: "전체 챌린지" },
	{ value: "mine", label: "내가 만든 챌린지" },
] as const;

// Sort options
const SORT_OPTIONS = [
	{ value: "recommended", label: "추천순" },
	{ value: "views", label: "조회순" },
	{ value: "latest", label: "최신순" },
] as const;

/**
 * Dropdown-based filter and sort controls
 *
 * @example
 * ```tsx
 * <ChallengeSortControls
 *   sortBy={sortBy}
 *   onSortChange={handleSortChange}
 *   filter={filter}
 *   onFilterChange={handleFilterChange}
 * />
 * ```
 */
export default function ChallengeSortControls({
	sortBy,
	onSortChange,
	filter,
	onFilterChange,
	className = "",
}: ChallengeSortControlsProps) {
	return (
		<div
			className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-center md:gap-6 ${className}`}
		>
			{/* Filter dropdown */}
			<ChalkSelect
				value={filter}
				options={FILTER_OPTIONS}
				onChange={(value) => onFilterChange(value as ChallengeFilter)}
				label="필터"
				className="w-full md:w-auto md:min-w-[200px]"
			/>

			{/* Sort dropdown */}
			<ChalkSelect
				value={sortBy}
				options={SORT_OPTIONS}
				onChange={(value) => onSortChange(value as ChallengeSortBy)}
				label="정렬"
				className="w-full md:w-auto md:min-w-[180px]"
			/>
		</div>
	);
}
