/**
 * useChallengeList Hook
 *
 * Custom hook for fetching challenge list data.
 * Refactored to focus solely on data fetching - pagination logic moved to page level.
 *
 * Follows Single Responsibility Principle: Only manages data fetching and sorting.
 */

import { useEffect, useState } from "react";
import {
	type ChallengeSortBy,
	getAllChallenges,
	getPublicChallengesCount,
} from "@/entities/challenge";

interface Challenge {
	id: string;
	title: string;
	viewCount: number;
	thumbnail: string;
	createdAt: string;
}

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
	challenges: Challenge[];

	/**
	 * Whether challenges are being loaded
	 */
	isLoading: boolean;

	/**
	 * Total number of challenges
	 */
	totalCount: number;

	/**
	 * Reload challenges data
	 */
	reload: () => Promise<void>;
}

/**
 * Custom hook for challenge data fetching
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
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [totalCount, setTotalCount] = useState(0);

	// Load total count on mount
	useEffect(() => {
		const loadInitialData = async () => {
			try {
				const count = await getPublicChallengesCount();
				setTotalCount(count);
			} catch (error) {
				console.error("Failed to load challenge count:", error);
			}
		};

		loadInitialData();
	}, []);

	// Load challenges when dependencies change
	useEffect(() => {
		const loadChallenges = async () => {
			setIsLoading(true);
			try {
				const data = await getAllChallenges(itemsPerPage, offset, sortBy);
				setChallenges(data);
			} catch (error) {
				console.error("Failed to load challenges:", error);
				setChallenges([]);
			} finally {
				setIsLoading(false);
			}
		};

		loadChallenges();
	}, [itemsPerPage, offset, sortBy]);

	// Reload function for manual refresh
	const reload = async () => {
		setIsLoading(true);
		try {
			const data = await getAllChallenges(itemsPerPage, offset, sortBy);
			setChallenges(data);
		} catch (error) {
			console.error("Failed to reload challenges:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		challenges,
		isLoading,
		totalCount,
		reload,
	};
};
