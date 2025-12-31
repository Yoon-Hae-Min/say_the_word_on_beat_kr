/**
 * useSort Hook
 *
 * Generic hook for managing sort state.
 * Reusable across any sortable list.
 */

import { useCallback, useState } from "react";

export interface UseSortOptions<T> {
	/**
	 * Initial sort value
	 */
	initialSort: T;

	/**
	 * Callback when sort changes
	 */
	onSortChange?: (newSort: T) => void;
}

export interface UseSortReturn<T> {
	/**
	 * Current sort value
	 */
	sortBy: T;

	/**
	 * Change sort value
	 */
	setSort: (newSort: T) => void;
}

/**
 * Custom hook for sort state management
 *
 * @example
 * ```tsx
 * const sort = useSort({
 *   initialSort: 'views' as ChallengeSortBy,
 *   onSortChange: (newSort) => {
 *     console.log('Sort changed to:', newSort);
 *   },
 * });
 *
 * <button onClick={() => sort.setSort('latest')}>Latest</button>
 * ```
 */
export const useSort = <T>({
	initialSort,
	onSortChange,
}: UseSortOptions<T>): UseSortReturn<T> => {
	const [sortBy, setSortBy] = useState<T>(initialSort);

	const setSort = useCallback(
		(newSort: T) => {
			setSortBy(newSort);
			onSortChange?.(newSort);
		},
		[onSortChange]
	);

	return {
		sortBy,
		setSort,
	};
};
