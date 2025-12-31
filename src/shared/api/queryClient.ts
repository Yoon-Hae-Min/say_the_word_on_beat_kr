"use client";

import { QueryClient } from "@tanstack/react-query";

/**
 * Tanstack Query Client Configuration
 *
 * 트래픽 절감 최적화 설정:
 * - staleTime: 5분 (데이터가 5분간 신선하다고 간주, 재요청 안함)
 * - gcTime: 10분 (사용하지 않는 캐시를 10분간 메모리에 보관)
 * - refetchOnWindowFocus: false (탭 전환 시 재요청 방지)
 */
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
			refetchOnWindowFocus: false,
			refetchOnMount: false, // 컴포넌트 재마운트 시 재요청 방지
			retry: 1, // 실패 시 1번만 재시도
		},
	},
});
