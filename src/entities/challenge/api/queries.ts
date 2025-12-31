"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ChallengeSortBy } from "../model/types";
import {
	getAllChallenges,
	getPopularChallenges,
	getPublicChallengesCount,
} from "./repository";

/**
 * Query Keys - 캐시 키 관리
 */
export const challengeKeys = {
	all: ["challenges"] as const,
	popular: (limit: number) => [...challengeKeys.all, "popular", limit] as const,
	list: (filters: { limit: number; offset: number; sortBy: ChallengeSortBy }) =>
		[...challengeKeys.all, "list", filters] as const,
	count: () => [...challengeKeys.all, "count"] as const,
};

/**
 * 인기 챌린지 목록 조회 Query Hook
 *
 * @param limit - 가져올 챌린지 수 (기본값: 9)
 * @returns 인기 챌린지 목록 및 로딩 상태
 */
export function usePopularChallenges(limit: number = 9): UseQueryResult<
	Array<{
		id: string;
		title: string;
		viewCount: number;
		thumbnail: string;
		showNames: boolean;
		createdAt: string;
	}>
> {
	return useQuery({
		queryKey: challengeKeys.popular(limit),
		queryFn: () => getPopularChallenges(limit),
		staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
	});
}

/**
 * 전체 챌린지 목록 조회 Query Hook (페이지네이션)
 */
export function useAllChallenges(
	limit: number,
	offset: number,
	sortBy: ChallengeSortBy
): UseQueryResult<
	Array<{
		id: string;
		title: string;
		viewCount: number;
		thumbnail: string;
		showNames: boolean;
		createdAt: string;
	}>
> {
	return useQuery({
		queryKey: challengeKeys.list({ limit, offset, sortBy }),
		queryFn: () => getAllChallenges(limit, offset, sortBy),
		staleTime: 5 * 60 * 1000,
	});
}

/**
 * 전체 챌린지 수 조회 Query Hook
 */
export function usePublicChallengesCount(): UseQueryResult<number> {
	return useQuery({
		queryKey: challengeKeys.count(),
		queryFn: getPublicChallengesCount,
		staleTime: 10 * 60 * 1000, // 총 개수는 자주 안 바뀌므로 10분 캐시
	});
}
