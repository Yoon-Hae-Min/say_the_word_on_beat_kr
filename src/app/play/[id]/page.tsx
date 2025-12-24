"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { DatabaseChallenge } from "@/entities/challenge";
import { WoodFrame } from "@/shared/ui";
import GameStage from "@/features/game-play/ui/GameStage";
import {
	getChallengeById,
	incrementViewCount,
} from "@/features/game-play/api/challengeService";

export default function PlayPage() {
  const params = useParams();
  const challengeId = params.id as string;

  const [challengeData, setChallengeData] = useState<DatabaseChallenge | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load challenge data from Supabase
    const loadChallenge = async () => {
      try {
        const data = await getChallengeById(challengeId);

        if (data) {
          setChallengeData(data);

          // Increment view count (non-blocking)
          incrementViewCount(challengeId);
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
