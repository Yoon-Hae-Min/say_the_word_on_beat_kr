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
 * This function implements an ellipsis-based pagination pattern:
 * - Always show first and last page
 * - Show pages around current page
 * - Use "..." for gaps
 *
 * Examples:
 * - Total pages = 5, current = 3: [1, 2, 3, 4, 5]
 * - Total pages = 10, current = 5: [1, "...", 4, 5, 6, "...", 10]
 *
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @param maxVisiblePages - Maximum number of page buttons to show (excluding ellipses)
 * @returns Array of page numbers and ellipses ("...")
 */
export const generatePageNumbers = (
	currentPage: number,
	totalPages: number,
	maxVisiblePages: number = 5
): (number | string)[] => {
	const pages: (number | string)[] = [];

	if (totalPages <= maxVisiblePages) {
		// Show all pages if total is small enough
		for (let i = 1; i <= totalPages; i++) {
			pages.push(i);
		}
		return pages;
	}

	// Always show first page
	pages.push(1);

	// Show ellipsis if current page is far from start
	if (currentPage > 3) {
		pages.push("...");
	}

	// Calculate range of pages to show around current page
	const start = Math.max(2, currentPage - 1);
	const end = Math.min(totalPages - 1, currentPage + 1);

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	// Show ellipsis if current page is far from end
	if (currentPage < totalPages - 2) {
		pages.push("...");
	}

	// Always show last page
	if (totalPages > 1) {
		pages.push(totalPages);
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
