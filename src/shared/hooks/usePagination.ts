/**
 * usePagination Hook
 *
 * Reusable custom hook for managing pagination state.
 * Extracted from ChallengesPage component.
 *
 * This hook provides a complete pagination solution with state management,
 * navigation handlers, and page number generation.
 */

import { useCallback, useMemo, useState } from "react";
import {
	calculateOffset,
	calculateTotalPages,
	generatePageNumbers,
	getSafePage,
} from "../lib/pagination/paginationUtils";

export interface UsePaginationOptions {
	/**
	 * Total number of items
	 */
	totalCount: number;

	/**
	 * Number of items to display per page
	 */
	itemsPerPage: number;

	/**
	 * Initial page number (1-based)
	 * @default 1
	 */
	initialPage?: number;

	/**
	 * Number of pages to show per block
	 * @default 10
	 */
	pagesPerBlock?: number;

	/**
	 * Callback fired when page changes
	 */
	onPageChange?: (page: number) => void;

	/**
	 * Callback fired when page changes (receives offset instead of page number)
	 * Useful for direct database queries
	 */
	onOffsetChange?: (offset: number, page: number) => void;
}

export interface UsePaginationReturn {
	/**
	 * Current page number (1-based)
	 */
	currentPage: number;

	/**
	 * Total number of pages
	 */
	totalPages: number;

	/**
	 * Current offset for database queries (0-based)
	 */
	offset: number;

	/**
	 * Array of page numbers to display (10 consecutive pages in current block)
	 */
	pageNumbers: number[];

	/**
	 * Whether there is a previous page
	 */
	hasPrevious: boolean;

	/**
	 * Whether there is a next page
	 */
	hasNext: boolean;

	/**
	 * Navigation handlers
	 */
	handlers: {
		/**
		 * Go to a specific page
		 */
		goToPage: (page: number) => void;

		/**
		 * Go to previous page
		 */
		goToPrevious: () => void;

		/**
		 * Go to next page
		 */
		goToNext: () => void;

		/**
		 * Go to first page
		 */
		goToFirst: () => void;

		/**
		 * Go to last page
		 */
		goToLast: () => void;
	};
}

/**
 * Custom hook for pagination state management
 *
 * @example
 * ```tsx
 * const pagination = usePagination({
 *   totalCount: 100,
 *   itemsPerPage: 10,
 *   onPageChange: (page) => {
 *     console.log('Page changed to:', page);
 *   },
 * });
 *
 * return (
 *   <div>
 *     <p>Page {pagination.currentPage} of {pagination.totalPages}</p>
 *     <button onClick={pagination.handlers.goToPrevious}>Previous</button>
 *     <button onClick={pagination.handlers.goToNext}>Next</button>
 *   </div>
 * );
 * ```
 */
export const usePagination = ({
	totalCount,
	itemsPerPage,
	initialPage = 1,
	pagesPerBlock = 10,
	onPageChange,
	onOffsetChange,
}: UsePaginationOptions): UsePaginationReturn => {
	const [currentPage, setCurrentPage] = useState(initialPage);

	// Calculate total pages
	const totalPages = useMemo(
		() => calculateTotalPages(totalCount, itemsPerPage),
		[totalCount, itemsPerPage]
	);

	// Calculate offset for database queries
	const offset = useMemo(
		() => calculateOffset(currentPage, itemsPerPage),
		[currentPage, itemsPerPage]
	);

	// Generate page numbers to display
	const pageNumbers = useMemo(
		() => generatePageNumbers(currentPage, totalPages, pagesPerBlock),
		[currentPage, totalPages, pagesPerBlock]
	);

	// Check if previous/next pages exist
	const hasPrevious = currentPage > 1;
	const hasNext = currentPage < totalPages;

	// Go to specific page (with safety check)
	const goToPage = useCallback(
		(page: number) => {
			const safePage = getSafePage(page, totalPages);
			setCurrentPage(safePage);
			onPageChange?.(safePage);
			onOffsetChange?.(calculateOffset(safePage, itemsPerPage), safePage);
		},
		[totalPages, itemsPerPage, onPageChange, onOffsetChange]
	);

	// Go to previous page
	const goToPrevious = useCallback(() => {
		if (hasPrevious) {
			goToPage(currentPage - 1);
		}
	}, [currentPage, hasPrevious, goToPage]);

	// Go to next page
	const goToNext = useCallback(() => {
		if (hasNext) {
			goToPage(currentPage + 1);
		}
	}, [currentPage, hasNext, goToPage]);

	// Go to first page
	const goToFirst = useCallback(() => {
		goToPage(1);
	}, [goToPage]);

	// Go to last page
	const goToLast = useCallback(() => {
		goToPage(totalPages);
	}, [totalPages, goToPage]);

	return {
		currentPage,
		totalPages,
		offset,
		pageNumbers,
		hasPrevious,
		hasNext,
		handlers: {
			goToPage,
			goToPrevious,
			goToNext,
			goToFirst,
			goToLast,
		},
	};
};
