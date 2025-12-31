/**
 * useChallengeList Hook
 *
 * Custom hook for fetching challenge list data using Tanstack Query.
 * Refactored to use query hooks for automatic caching and deduplication.
 *
 * Follows Single Responsibility Principle: Only manages data fetching and sorting.
 */

import {
	useAllChallenges,
	usePublicChallengesCount,
} from "@/entities/challenge/api/queries";
import type { ChallengeSortBy } from "@/entities/challenge";

export interface UseChallengeListOptions {
	/**
	 * Number of items per page
	 */
	itemsPerPage: number;

	/**
	 * Current page offset
	 */
	offset: number;

	/**
	 * Sort order
	 */
	sortBy: ChallengeSortBy;
}

export interface UseChallengeListReturn {
	/**
	 * List of challenges for current page
	 */
	challenges: Array<{
		id: string;
		title: string;
		viewCount: number;
		thumbnail: string;
		createdAt: string;
	}>;

	/**
	 * Whether challenges are being loaded
	 */
	isLoading: boolean;

	/**
	 * Total number of challenges
	 */
	totalCount: number;
}

/**
 * Custom hook for challenge data fetching with Tanstack Query
 *
 * This hook focuses solely on data fetching. Pagination state is managed by the parent component.
 *
 * @example
 * ```tsx
 * const pagination = usePagination({ totalCount, itemsPerPage: 12 });
 * const challengeList = useChallengeList({
 *   itemsPerPage: 12,
 *   offset: pagination.offset,
 *   sortBy: 'views',
 * });
 *
 * return (
 *   <>
 *     <ChallengeGrid challenges={challengeList.challenges} />
 *     <PaginationControls {...pagination} />
 *   </>
 * );
 * ```
 */
export const useChallengeList = ({
	itemsPerPage,
	offset,
	sortBy,
}: UseChallengeListOptions): UseChallengeListReturn => {
	const { data: challenges = [], isLoading: isChallengesLoading } = useAllChallenges(
		itemsPerPage,
		offset,
		sortBy
	);

	const { data: totalCount = 0, isLoading: isCountLoading } = usePublicChallengesCount();

	return {
		challenges,
		isLoading: isChallengesLoading || isCountLoading,
		totalCount,
	};
};
