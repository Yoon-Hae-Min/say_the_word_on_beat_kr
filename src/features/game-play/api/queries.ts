"use client";

import { useQuery } from "@tanstack/react-query";
import type { ClientSafeChallenge } from "@/entities/challenge";
import { getChallengeById } from "./challengeService";

export const gamePlayKeys = {
	challenge: (id: string) => ["game-play", "challenge", id] as const,
};

export function useChallengeQuery(id: string, userId?: string) {
	return useQuery<ClientSafeChallenge | null>({
		queryKey: gamePlayKeys.challenge(id),
		queryFn: () => getChallengeById(id, userId),
		staleTime: 10 * 60 * 1000,
	});
}
