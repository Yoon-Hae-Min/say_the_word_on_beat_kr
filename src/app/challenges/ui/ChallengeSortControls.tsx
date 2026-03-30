/**
 * ChallengeSortControls Component
 *
 * Sort dropdown for challenges page, aligned to the right.
 */

import type { ChallengeSortBy } from "@/entities/challenge";
import { ChalkSelect } from "@/shared/ui";

interface ChallengeSortControlsProps {
	sortBy: ChallengeSortBy;
	onSortChange: (sort: ChallengeSortBy) => void;
	className?: string;
}

const SORT_OPTIONS = [
	{ value: "recommended", label: "추천순" },
	{ value: "views", label: "조회순" },
	{ value: "views_week", label: "이번주 인기" },
	{ value: "views_month", label: "이번달 인기" },
	{ value: "latest", label: "최신순" },
] as const;

export default function ChallengeSortControls({
	sortBy,
	onSortChange,
	className = "",
}: ChallengeSortControlsProps) {
	return (
		<div className={`flex justify-end ${className}`}>
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
