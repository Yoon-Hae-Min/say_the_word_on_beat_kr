/**
 * PaginationControls Component
 *
 * Reusable pagination UI component.
 * Extracted from ChallengesPage to promote reusability.
 *
 * This component provides a complete pagination interface with:
 * - Previous/Next buttons
 * - Page number buttons
 * - Ellipses for large page counts
 * - Active page highlighting
 */

import { ChevronLeft, ChevronRight } from "lucide-react";
import ChalkButton from "./ChalkButton";

interface PaginationControlsProps {
	/**
	 * Current page number (1-based)
	 */
	currentPage: number;

	/**
	 * Total number of pages
	 */
	totalPages: number;

	/**
	 * Array of page numbers to display (can include "..." for ellipses)
	 */
	pageNumbers: (number | string)[];

	/**
	 * Whether there is a previous page
	 */
	hasPrevious: boolean;

	/**
	 * Whether there is a next page
	 */
	hasNext: boolean;

	/**
	 * Callback when previous button is clicked
	 */
	onPrevious: () => void;

	/**
	 * Callback when next button is clicked
	 */
	onNext: () => void;

	/**
	 * Callback when a page number is clicked
	 */
	onPageClick: (page: number) => void;

	/**
	 * Additional CSS classes for the container
	 */
	className?: string;
}

/**
 * Pagination controls component with Previous/Next and page number buttons
 *
 * @example
 * ```tsx
 * const pagination = usePagination({ totalCount: 100, itemsPerPage: 10 });
 *
 * <PaginationControls
 *   currentPage={pagination.currentPage}
 *   totalPages={pagination.totalPages}
 *   pageNumbers={pagination.pageNumbers}
 *   hasPrevious={pagination.hasPrevious}
 *   hasNext={pagination.hasNext}
 *   onPrevious={pagination.handlers.goToPrevious}
 *   onNext={pagination.handlers.goToNext}
 *   onPageClick={pagination.handlers.goToPage}
 * />
 * ```
 */
export function PaginationControls({
	currentPage,
	totalPages,
	pageNumbers,
	hasPrevious,
	hasNext,
	onPrevious,
	onNext,
	onPageClick,
	className = "",
}: PaginationControlsProps) {
	// Don't render if there's only one page
	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className={`flex items-center justify-center gap-2 ${className}`}>
			{/* Previous button */}
			<ChalkButton
				variant="white"
				onClick={onPrevious}
				disabled={!hasPrevious}
				className="flex items-center gap-1 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<ChevronLeft size={20} />
				<span className="hidden sm:inline">이전</span>
			</ChalkButton>

			{/* Page numbers */}
			<div className="flex gap-2">
				{pageNumbers.map((page) => {
					if (page === "...") {
						return (
							<span
								key={`ellipsis-${Math.random()}`}
								className="flex h-10 w-10 items-center justify-center text-chalk-white"
							>
								...
							</span>
						);
					}

					const pageNum = page as number;
					const isActive = pageNum === currentPage;

					return (
						<button
							key={pageNum}
							type="button"
							onClick={() => onPageClick(pageNum)}
							className={`flex h-10 w-10 items-center justify-center rounded transition-all ${
								isActive
									? "scale-110 bg-chalk-yellow font-bold text-chalkboard-bg"
									: "bg-chalk-white/20 text-chalk-white hover:scale-105 hover:bg-chalk-white/30"
							}`}
							aria-current={isActive ? "page" : undefined}
							aria-label={`페이지 ${pageNum}`}
						>
							{pageNum}
						</button>
					);
				})}
			</div>

			{/* Next button */}
			<ChalkButton
				variant="white"
				onClick={onNext}
				disabled={!hasNext}
				className="flex items-center gap-1 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<span className="hidden sm:inline">다음</span>
				<ChevronRight size={20} />
			</ChalkButton>
		</div>
	);
}
