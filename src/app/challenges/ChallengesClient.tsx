/**
 * ChallengesPage Client Component
 *
 * Page for browsing all public challenges.
 * Filter removed — "내 챌린지" is now a separate /my page.
 */

"use client";

import { ArrowLeft, Plus, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ChallengeSortBy } from "@/entities/challenge";
import { usePagination, useURLSearchParams } from "@/shared/hooks";
import { trackChallengeSearch } from "@/shared/lib/analytics/gtag";
import { getUserId } from "@/shared/lib/user/fingerprint";
import { EmptyState, LoadingState, PaginationControls, WoodFrame } from "@/shared/ui";
import ResponsiveAdFit from "@/shared/ui/ResponsiveAdFit";
import { useChallengeList } from "./hooks/useChallengeList";
import ChallengeGrid from "./ui/ChallengeGrid";
import ChallengeSortControls from "./ui/ChallengeSortControls";

const ITEMS_PER_PAGE = 12;

export default function ChallengesContent() {
	const router = useRouter();

	const urlParams = useURLSearchParams({
		defaults: { page: "1", sort: "recommended" },
		basePath: "/challenges",
	});

	const currentPage = Number(urlParams.get("page"));
	const sortBy = urlParams.get("sort") as ChallengeSortBy;
	const userId = getUserId();
	const offset = (currentPage - 1) * ITEMS_PER_PAGE;

	const challengeList = useChallengeList({
		itemsPerPage: ITEMS_PER_PAGE,
		offset,
		sortBy,
		filter: "all",
		userId,
	});

	const pagination = usePagination({
		totalCount: challengeList.totalCount,
		itemsPerPage: ITEMS_PER_PAGE,
		initialPage: currentPage,
		onPageChange: (page) => {
			urlParams.set({ page: page.toString() });
		},
	});

	const handleSortChange = (newSort: ChallengeSortBy) => {
		trackChallengeSearch(newSort, 1);
		urlParams.set({ sort: newSort, page: "1" });
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<WoodFrame>
			<main id="main-content" className="min-h-screen bg-chalkboard-bg px-4 py-8 md:py-16">
				<div className="mx-auto max-w-6xl">
					{/* Header */}
					<div className="mb-8 flex items-center justify-between">
						<button
							type="button"
							onClick={() => router.push("/")}
							className="flex items-center gap-2 text-chalk-white transition-colors hover:text-chalk-yellow"
						>
							<ArrowLeft size={24} />
							<span className="chalk-text text-lg md:text-xl">홈으로</span>
						</button>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => router.push("/maker")}
								className="flex h-10 items-center gap-2 rounded-lg border-2 border-chalk-yellow/60 bg-chalkboard-bg/80 px-3 transition-all hover:border-chalk-yellow hover:scale-105 md:h-11 md:px-4"
							>
								<Plus className="h-5 w-5 text-chalk-yellow" />
								<span className="chalk-text text-sm text-chalk-yellow">만들기</span>
							</button>
							<button
								type="button"
								onClick={() => router.push("/my")}
								className="flex h-10 items-center gap-2 rounded-lg border-2 border-chalk-white/40 bg-chalkboard-bg/80 px-3 transition-all hover:border-chalk-yellow hover:scale-105 md:h-11 md:px-4"
							>
								<UserCircle className="h-5 w-5 text-chalk-white" />
								<span className="chalk-text text-sm text-chalk-white">내 챌린지</span>
							</button>
						</div>
					</div>

					{/* Page title */}
					<h1 className="chalk-text mb-4 text-center text-3xl font-bold text-chalk-white md:text-5xl">
						공개된 챌린지
					</h1>

					<p className="mb-12 text-center text-chalk-white/60">
						총 {challengeList.totalCount}개의 챌린지
					</p>

					<ChallengeSortControls sortBy={sortBy} onSortChange={handleSortChange} className="mb-8" />

					{challengeList.isLoading && <LoadingState />}

					{!challengeList.isLoading && challengeList.challenges.length === 0 && (
						<EmptyState
							message="아직 공개된 챌린지가 없습니다."
							description="첫 번째 챌린지를 만들어보세요!"
						/>
					)}

					{!challengeList.isLoading && challengeList.challenges.length > 0 && (
						<ChallengeGrid challenges={challengeList.challenges} />
					)}

					{!challengeList.isLoading && challengeList.challenges.length > 0 && (
						<ResponsiveAdFit className="mt-12" />
					)}

					{challengeList.challenges.length > 0 && (
						<PaginationControls
							currentPage={currentPage}
							totalPages={pagination.totalPages}
							hasPrevious={pagination.hasPrevious}
							hasNext={pagination.hasNext}
							onPrevious={pagination.handlers.goToPrevious}
							onNext={pagination.handlers.goToNext}
							onPageClick={pagination.handlers.goToPage}
							className="mt-12"
						/>
					)}
				</div>
			</main>
		</WoodFrame>
	);
}
