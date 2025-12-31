/**
 * ChallengesPage Component (Refactored)
 *
 * Page for browsing all public challenges.
 * Refactored to use custom hooks and composition of smaller components.
 *
 * This is the refactored version that will replace the original page.tsx
 */

"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState, LoadingState, PaginationControls, WoodFrame } from "@/shared/ui";
import { useChallengeList } from "./hooks/useChallengeList";
import ChallengeGrid from "./ui/ChallengeGrid";
import ChallengeSortControls from "./ui/ChallengeSortControls";

export default function ChallengesPage() {
	const router = useRouter();

	// Use custom hook for challenge list management
	const challengeList = useChallengeList({
		itemsPerPage: 12,
		initialSort: "views",
	});

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
					{challengeList.totalCount > 0 && (
						<p className="mb-12 text-center text-chalk-white/60">
							총 {challengeList.totalCount}개의 챌린지
						</p>
					)}

					{/* Sorting buttons */}
					{challengeList.totalCount > 0 && (
						<ChallengeSortControls
							sortBy={challengeList.sortBy}
							onSortChange={challengeList.setSortBy}
							className="mb-8"
						/>
					)}

					{/* Loading state */}
					{challengeList.isLoading && <LoadingState />}

					{/* Empty state */}
					{!challengeList.isLoading && challengeList.challenges.length === 0 && (
						<EmptyState
							message="아직 공개된 챌린지가 없습니다."
							description="첫 번째 챌린지를 만들어보세요!"
						/>
					)}

					{/* Challenge grid and pagination */}
					{!challengeList.isLoading && challengeList.challenges.length > 0 && (
						<>
							<ChallengeGrid challenges={challengeList.challenges} />

							{/* Pagination controls */}
							<PaginationControls
								currentPage={challengeList.pagination.currentPage}
								totalPages={challengeList.pagination.totalPages}
								pageNumbers={challengeList.pagination.pageNumbers}
								hasPrevious={challengeList.pagination.hasPrevious}
								hasNext={challengeList.pagination.hasNext}
								onPrevious={challengeList.pagination.handlers.goToPrevious}
								onNext={challengeList.pagination.handlers.goToNext}
								onPageClick={challengeList.pagination.handlers.goToPage}
								className="mt-12"
							/>
						</>
					)}
				</div>
			</div>
		</WoodFrame>
	);
}
