/**
 * ChallengesPage Component (Refactored)
 *
 * Page for browsing all public challenges.
 * Clean architecture: page manages UI state via URL, hook manages data.
 *
 * Architecture:
 * - Page level: currentPage, sortBy from URL query parameters
 * - useChallengeList: Data fetching only
 * - usePagination: Pagination calculation utilities
 */

"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import type { ChallengeSortBy } from "@/entities/challenge";
import { usePagination, useURLSearchParams } from "@/shared/hooks";
import {
  EmptyState,
  LoadingState,
  PaginationControls,
  WoodFrame,
} from "@/shared/ui";
import { useChallengeList } from "./hooks/useChallengeList";
import ChallengeGrid from "./ui/ChallengeGrid";
import ChallengeSortControls from "./ui/ChallengeSortControls";

const ITEMS_PER_PAGE = 12;

function ChallengesContent() {
  const router = useRouter();

  // Manage state via URL query parameters
  const urlParams = useURLSearchParams({
    defaults: { page: "1", sort: "views" },
    basePath: "/challenges",
  });

  // Get current state from URL
  const currentPage = Number(urlParams.get("page"));
  const sortBy = urlParams.get("sort") as ChallengeSortBy;

  // Calculate offset
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Fetch challenge data
  const challengeList = useChallengeList({
    itemsPerPage: ITEMS_PER_PAGE,
    offset,
    sortBy,
  });

  // Use pagination for UI calculations only (not for state management)
  const pagination = usePagination({
    totalCount: challengeList.totalCount,
    itemsPerPage: ITEMS_PER_PAGE,
    initialPage: currentPage,
    onPageChange: (page) => {
      urlParams.set({ page: page.toString() });
    },
  });

  // Handle sort change - reset to page 1
  const handleSortChange = (newSort: ChallengeSortBy) => {
    urlParams.set({ sort: newSort, page: "1" });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          {challengeList.totalCount > 0 && (
            <p className="mb-12 text-center text-chalk-white/60">
              총 {challengeList.totalCount}개의 챌린지
            </p>
          )}

          {/* Sorting buttons */}
          {challengeList.totalCount > 0 && (
            <ChallengeSortControls
              sortBy={sortBy}
              onSortChange={handleSortChange}
              className="mb-8"
            />
          )}

          {/* Loading state */}
          {challengeList.isLoading && <LoadingState />}

          {/* Empty state */}
          {!challengeList.isLoading &&
            challengeList.challenges.length === 0 && (
              <EmptyState
                message="아직 공개된 챌린지가 없습니다."
                description="첫 번째 챌린지를 만들어보세요!"
              />
            )}

          {/* Challenge grid and pagination */}
          {!challengeList.isLoading && challengeList.challenges.length > 0 && (
            <ChallengeGrid challenges={challengeList.challenges} />
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
      </div>
    </WoodFrame>
  );
}

export default function ChallengesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ChallengesContent />
    </Suspense>
  );
}
