"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Challenge, ChallengeData } from "@/entities/challenge";
import { WoodFrame } from "@/shared/ui";
import GameStage from "@/features/game-play/ui/GameStage";

export default function PlayPage() {
  const params = useParams();
  const challengeId = params.id as string;

  const [challengeData, setChallengeData] = useState<ChallengeData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load challenge data from localStorage
    const loadChallenge = () => {
      try {
        const stored = localStorage.getItem(`challenge_${challengeId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setChallengeData(parsed.data);

          // Increment view count
          const currentViewCount = parsed.viewCount || 0;
          const updated = {
            ...parsed,
            viewCount: currentViewCount + 1,
          };
          localStorage.setItem(
            `challenge_${challengeId}`,
            JSON.stringify(updated)
          );
        } else {
          console.error("Challenge not found");
        }
      } catch (error) {
        console.error("Error loading challenge:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenge();
  }, [challengeId]);

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
            <p className="text-chalk-white chalk-text text-2xl mb-4">
              챌린지를 찾을 수 없습니다
            </p>
            <a
              href="/"
              className="text-chalk-yellow hover:text-chalk-yellow/80 underline"
            >
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
