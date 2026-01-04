/**
 * useChallengeList Hook
 *
 * Custom hook for fetching challenge list data using Tanstack Query.
 * Refactored to use query hooks for automatic caching and deduplication.
 *
 * Follows Single Responsibility Principle: Only manages data fetching and sorting.
 */

import type { ChallengeFilter, ChallengeSortBy } from "@/entities/challenge";
import {
	useAllChallenges,
	useMyChallenges,
	useMyChallengesCount,
	usePublicChallengesCount,
} from "@/entities/challenge/api/queries";

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

	/**
	 * Filter option (all or mine)
	 */
	filter: ChallengeFilter;

	/**
	 * User ID for filtering "mine" challenges
	 */
	userId: string;
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
		isPublic: boolean;
		createdAt: string;
		difficultyEasy: number;
		difficultyNormal: number;
		difficultyHard: number;
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
 *   filter: 'all',
 *   userId: 'fp_xxx',
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
	filter,
	userId,
}: UseChallengeListOptions): UseChallengeListReturn => {
	// Conditionally fetch based on filter
	const { data: allChallenges = [], isLoading: isAllLoading } = useAllChallenges(
		itemsPerPage,
		offset,
		sortBy
	);

	const { data: myChallenges = [], isLoading: isMyLoading } = useMyChallenges(
		userId,
		itemsPerPage,
		offset,
		sortBy
	);

	const { data: totalCount = 0, isLoading: isCountLoading } = usePublicChallengesCount();

	const { data: myTotalCount = 0, isLoading: isMyCountLoading } = useMyChallengesCount(userId);

	return {
		challenges: filter === "mine" ? myChallenges : allChallenges,
		isLoading: filter === "mine" ? isMyLoading || isMyCountLoading : isAllLoading || isCountLoading,
		totalCount: filter === "mine" ? myTotalCount : totalCount,
	};
};
