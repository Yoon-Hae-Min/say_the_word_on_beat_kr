/**
 * useChallengeList Hook
 *
 * Custom hook for managing challenge list with pagination and sorting.
 * Extracted from ChallengesPage component.
 *
 * Coordinates data fetching, pagination, and sorting state.
 */

import { useEffect, useState } from "react";
import {
	type ChallengeSortBy,
	getAllChallenges,
	getPublicChallengesCount,
} from "@/entities/challenge";
import { usePagination } from "@/shared/hooks";

interface Challenge {
	id: string;
	title: string;
	viewCount: number;
	thumbnail: string;
	createdAt: string;
}

const CHALLENGES_PER_PAGE = 12;

export interface UseChallengeListOptions {
	/**
	 * Number of challenges to display per page
	 * @default 12
	 */
	itemsPerPage?: number;

	/**
	 * Initial sort order
	 * @default "views"
	 */
	initialSort?: ChallengeSortBy;
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
	 * Current sort order
	 */
	sortBy: ChallengeSortBy;

	/**
	 * Change sort order
	 */
	setSortBy: (sort: ChallengeSortBy) => void;

	/**
	 * Pagination state and handlers
	 */
	pagination: ReturnType<typeof usePagination>;
}

/**
 * Custom hook for challenge list management
 *
 * @example
 * ```tsx
 * const challengeList = useChallengeList({ itemsPerPage: 12 });
 *
 * if (challengeList.isLoading) {
 *   return <LoadingState />;
 * }
 *
 * return (
 *   <>
 *     <ChallengeGrid challenges={challengeList.challenges} />
 *     <PaginationControls {...challengeList.pagination} />
 *   </>
 * );
 * ```
 */
export const useChallengeList = ({
	itemsPerPage = CHALLENGES_PER_PAGE,
	initialSort = "views",
}: UseChallengeListOptions = {}): UseChallengeListReturn => {
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [totalCount, setTotalCount] = useState(0);
	const [sortBy, setSortBy] = useState<ChallengeSortBy>(initialSort);

	// Initialize pagination
	const pagination = usePagination({
		totalCount,
		itemsPerPage,
		initialPage: 1,
		onPageChange: () => {
			// Scroll to top when page changes
			window.scrollTo({ top: 0, behavior: "smooth" });
		},
	});

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

	// Load challenges when page or sort changes
	useEffect(() => {
		const loadChallenges = async () => {
			setIsLoading(true);
			try {
				const data = await getAllChallenges(itemsPerPage, pagination.offset, sortBy);
				setChallenges(data);
			} catch (error) {
				console.error("Failed to load challenges:", error);
				setChallenges([]);
			} finally {
				setIsLoading(false);
			}
		};

		loadChallenges();
	}, [pagination.currentPage, sortBy, itemsPerPage, pagination.offset]);

	// Handle sort change - reset to first page
	const handleSortChange = (newSort: ChallengeSortBy) => {
		setSortBy(newSort);
		pagination.handlers.goToFirst();
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return {
		challenges,
		isLoading,
		totalCount,
		sortBy,
		setSortBy: handleSortChange,
		pagination,
	};
};
