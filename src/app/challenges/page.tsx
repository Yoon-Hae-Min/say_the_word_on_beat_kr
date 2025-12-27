"use client";

import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	type ChallengeSortBy,
	getAllChallenges,
	getPublicChallengesCount,
} from "@/entities/challenge";
import { ChalkButton, ChalkCard, WoodFrame } from "@/shared/ui";

interface Challenge {
	id: string;
	title: string;
	viewCount: number;
	thumbnail: string;
	createdAt: string;
}

const CHALLENGES_PER_PAGE = 12;

export default function ChallengesPage() {
	const router = useRouter();
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [sortBy, setSortBy] = useState<ChallengeSortBy>("views");

	const totalPages = Math.ceil(totalCount / CHALLENGES_PER_PAGE);

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

	useEffect(() => {
		const loadChallenges = async () => {
			setIsLoading(true);
			try {
				const offset = (currentPage - 1) * CHALLENGES_PER_PAGE;
				const data = await getAllChallenges(CHALLENGES_PER_PAGE, offset, sortBy);
				setChallenges(data);
			} catch (error) {
				console.error("Failed to load challenges:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadChallenges();
	}, [currentPage, sortBy]);

	const handleSortChange = (newSort: ChallengeSortBy) => {
		setSortBy(newSort);
		setCurrentPage(1);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handlePageClick = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Generate page numbers to display
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			// Show all pages if total is small
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (currentPage > 3) {
				pages.push("...");
			}

			// Show pages around current page
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push("...");
			}

			// Always show last page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	};

	return (
		<WoodFrame>
			<div className="min-h-screen bg-chalkboard-bg px-4 py-8 md:py-16">
				<div className="mx-auto max-w-6xl">
					{/* Header with back button */}
					<div className="mb-8 flex items-center justify-between">
						<button
							type="button"
							onClick={() => router.push("/")}
							className="flex items-center gap-2 text-chalk-white transition-colors hover:text-chalk-yellow"
						>
							<ArrowLeft size={24} />
							<span className="chalk-text text-lg md:text-xl">홈으로</span>
						</button>
					</div>

					{/* Page title */}
					<h1 className="chalk-text mb-4 text-center text-3xl font-bold text-chalk-white md:text-5xl">
						공개된 챌린지
					</h1>

					{/* Total count */}
					{totalCount > 0 && (
						<p className="mb-12 text-center text-chalk-white/60">총 {totalCount}개의 챌린지</p>
					)}

					{/* Sorting buttons */}
					{totalCount > 0 && (
						<div className="mb-8 flex justify-center gap-3">
							<ChalkButton
								variant={sortBy === "latest" ? "yellow" : "white"}
								onClick={() => handleSortChange("latest")}
								className="px-6 py-2 text-base md:text-lg"
							>
								최신순
							</ChalkButton>
							<ChalkButton
								variant={sortBy === "views" ? "yellow" : "white"}
								onClick={() => handleSortChange("views")}
								className="px-6 py-2 text-base md:text-lg"
							>
								조회순
							</ChalkButton>
						</div>
					)}

					{/* Loading state */}
					{isLoading && (
						<div className="py-12 text-center">
							<p className="chalk-text animate-pulse text-xl text-chalk-white">로딩 중...</p>
						</div>
					)}

					{/* Empty state */}
					{!isLoading && challenges.length === 0 && (
						<div className="py-12 text-center">
							<p className="chalk-text text-xl text-chalk-white">아직 공개된 챌린지가 없습니다.</p>
							<p className="mt-2 text-chalk-white/60">첫 번째 챌린지를 만들어보세요!</p>
						</div>
					)}

					{/* Challenge grid */}
					{!isLoading && challenges.length > 0 && (
						<>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{challenges.map((challenge, index) => (
									<div
										key={challenge.id}
										className="animate-fade-in"
										style={{
											animationDelay: `${index * 50}ms`,
											animationFillMode: "backwards",
										}}
									>
										<ChalkCard
											title={challenge.title}
											thumbnail={challenge.thumbnail}
											viewCount={challenge.viewCount}
											onClick={() => {
												router.push(`/play/${challenge.id}`);
											}}
										/>
									</div>
								))}
							</div>

							{/* Pagination controls */}
							{totalPages > 1 && (
								<div className="mt-12 flex items-center justify-center gap-2">
									{/* Previous button */}
									<ChalkButton
										variant="white"
										onClick={handlePreviousPage}
										disabled={currentPage === 1}
										className="flex items-center gap-1 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<ChevronLeft size={20} />
										<span className="hidden sm:inline">이전</span>
									</ChalkButton>

									{/* Page numbers */}
									<div className="flex gap-2">
										{getPageNumbers().map((page, index) => {
											if (page === "...") {
												return (
													<span
														key={`ellipsis-${index}`}
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
													onClick={() => handlePageClick(pageNum)}
													className={`flex h-10 w-10 items-center justify-center rounded transition-all ${
														isActive
															? "scale-110 bg-chalk-yellow font-bold text-chalkboard-bg"
															: "bg-chalk-white/20 text-chalk-white hover:scale-105 hover:bg-chalk-white/30"
													}`}
												>
													{pageNum}
												</button>
											);
										})}
									</div>

									{/* Next button */}
									<ChalkButton
										variant="white"
										onClick={handleNextPage}
										disabled={currentPage === totalPages}
										className="flex items-center gap-1 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<span className="hidden sm:inline">다음</span>
										<ChevronRight size={20} />
									</ChalkButton>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</WoodFrame>
	);
}
