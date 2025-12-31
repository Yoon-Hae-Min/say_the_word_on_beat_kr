/**
 * Pagination Utilities
 *
 * Reusable pagination logic extracted from ChallengesPage.
 * These pure functions can be used across any paginated view in the application.
 */

/**
 * Calculate total number of pages based on item count and items per page
 *
 * @param totalCount - Total number of items
 * @param itemsPerPage - Number of items to display per page
 * @returns Total number of pages
 */
export const calculateTotalPages = (totalCount: number, itemsPerPage: number): number => {
	if (itemsPerPage <= 0) {
		throw new Error("Items per page must be greater than 0");
	}

	return Math.ceil(totalCount / itemsPerPage);
};

/**
 * Calculate offset for database query based on current page
 *
 * @param currentPage - Current page number (1-based)
 * @param itemsPerPage - Number of items per page
 * @returns Offset for database query (0-based)
 */
export const calculateOffset = (currentPage: number, itemsPerPage: number): number => {
	if (currentPage < 1) {
		throw new Error("Current page must be at least 1");
	}

	return (currentPage - 1) * itemsPerPage;
};

/**
 * Generate page numbers to display in pagination controls
 *
 * This function implements a block-based pagination pattern:
 * - Desktop: Shows 10 consecutive page numbers at a time
 * - Mobile: Shows 5 consecutive page numbers at a time
 * - Current page determines which block is shown
 * - No ellipses needed
 *
 * Examples (Desktop - 10 per block):
 * - Total pages = 5, current = 3: [1, 2, 3, 4, 5]
 * - Total pages = 50, current = 1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * - Total pages = 50, current = 15: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
 * - Total pages = 50, current = 45: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
 *
 * Examples (Mobile - 5 per block):
 * - Total pages = 50, current = 1: [1, 2, 3, 4, 5]
 * - Total pages = 50, current = 7: [6, 7, 8, 9, 10]
 * - Total pages = 50, current = 48: [46, 47, 48, 49, 50]
 *
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @param pagesPerBlock - Number of pages to show per block (default: 10 for desktop, 5 for mobile)
 * @returns Array of page numbers in current block
 */
export const generatePageNumbers = (
	currentPage: number,
	totalPages: number,
	pagesPerBlock: number = 10
): number[] => {
	const pages: number[] = [];

	// Calculate which block the current page is in (1-based)
	const currentBlock = Math.ceil(currentPage / pagesPerBlock);

	// Calculate start and end of current block
	const blockStart = (currentBlock - 1) * pagesPerBlock + 1;
	const blockEnd = Math.min(currentBlock * pagesPerBlock, totalPages);

	// Generate page numbers for current block
	for (let i = blockStart; i <= blockEnd; i++) {
		pages.push(i);
	}

	return pages;
};

/**
 * Check if a page number is valid
 *
 * @param page - Page number to validate
 * @param totalPages - Total number of pages
 * @returns true if page is valid
 */
export const isValidPage = (page: number, totalPages: number): boolean => {
	return page >= 1 && page <= totalPages && Number.isInteger(page);
};

/**
 * Get safe page number (clamps to valid range)
 *
 * @param page - Requested page number
 * @param totalPages - Total number of pages
 * @returns Page number clamped to valid range [1, totalPages]
 */
export const getSafePage = (page: number, totalPages: number): number => {
	return Math.max(1, Math.min(page, totalPages));
};
