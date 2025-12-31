/**
 * PaginationControls Component
 *
 * Reusable pagination UI component.
 * Extracted from ChallengesPage to promote reusability.
 *
 * This component provides a complete pagination interface with:
 * - Previous/Next buttons
 * - Page number buttons (responsive: 10 on desktop, 5 on mobile)
 * - Active page highlighting
 * - Mobile-optimized design
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { generatePageNumbers } from "../lib/pagination/paginationUtils";
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
 * Automatically adapts to screen size: 10 pages on desktop, 5 on mobile
 *
 * @example
 * ```tsx
 * const pagination = usePagination({ totalCount: 100, itemsPerPage: 10 });
 *
 * <PaginationControls
 *   currentPage={pagination.currentPage}
 *   totalPages={pagination.totalPages}
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
	hasPrevious,
	hasNext,
	onPrevious,
	onNext,
	onPageClick,
	className = "",
}: PaginationControlsProps) {
	// Detect screen size for responsive pagination
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
		};

		// Check on mount
		checkMobile();

		// Listen for resize
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Generate page numbers based on screen size
	const pagesPerBlock = isMobile ? 5 : 10;
	const pageNumbers = generatePageNumbers(currentPage, totalPages, pagesPerBlock);

	// Don't render if there's only one page
	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className={`flex items-center justify-center gap-1 sm:gap-2 ${className}`}>
			{/* Previous button */}
			<ChalkButton
				variant="white"
				onClick={onPrevious}
				disabled={!hasPrevious}
				className="flex items-center gap-1 px-2 py-2 sm:px-3 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<ChevronLeft size={20} />
				<span className="hidden sm:inline">이전</span>
			</ChalkButton>

			{/* Page numbers */}
			<div className="flex gap-1 sm:gap-2">
				{pageNumbers.map((pageNum: number) => {
					const isActive = pageNum === currentPage;

					return (
						<button
							key={pageNum}
							type="button"
							onClick={() => onPageClick(pageNum)}
							className={`flex h-8 w-8 items-center justify-center rounded text-sm transition-all sm:h-10 sm:w-10 sm:text-base ${
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
				className="flex items-center gap-1 px-2 py-2 sm:px-3 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<span className="hidden sm:inline">다음</span>
				<ChevronRight size={20} />
			</ChalkButton>
		</div>
	);
}
