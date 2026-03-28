"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { GameStage, incrementViewCount, useChallengeQuery } from "@/features/game-play";
import { trackPlayPageView } from "@/shared/lib/analytics/gtag";
import { getUserId } from "@/shared/lib/user/fingerprint";
import { WoodFrame } from "@/shared/ui";

export default function PlayPage() {
	const params = useParams();
	const challengeId = params.id as string;
	const userId = getUserId();
	const viewCountedRef = useRef(false);

	const { data: challengeData, isLoading } = useChallengeQuery(challengeId, userId);

	// Increment view count once on successful load (external side effect)
	useEffect(() => {
		if (challengeData && !viewCountedRef.current) {
			viewCountedRef.current = true;
			incrementViewCount(challengeId);
			trackPlayPageView(challengeId);
		}
	}, [challengeData, challengeId]);

	if (isLoading) {
		return (
			<WoodFrame>
				<div className="min-h-screen flex items-center justify-center">
					<p className="text-chalk-white chalk-text text-2xl">로딩 중...</p>
				</div>
			</WoodFrame>
		);
	}

	if (!challengeData) {
		return (
			<WoodFrame>
				<div className="min-h-screen flex items-center justify-center">
					<div className="text-center">
						<p className="text-chalk-white chalk-text text-2xl mb-4">챌린지를 찾을 수 없습니다</p>
						<a href="/" className="text-chalk-yellow hover:text-chalk-yellow/80 underline">
							홈으로 돌아가기
						</a>
					</div>
				</div>
			</WoodFrame>
		);
	}

	return (
		<WoodFrame>
			<div className="h-full bg-chalkboard-bg">
				<GameStage challengeData={challengeData} />
			</div>
		</WoodFrame>
	);
}
