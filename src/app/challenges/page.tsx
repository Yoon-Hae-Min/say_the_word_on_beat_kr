"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllChallenges } from "@/entities/challenge";
import { ChalkCard, WoodFrame } from "@/shared/ui";
import { ArrowLeft } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  viewCount: number;
  thumbnail: string;
  createdAt: string;
}

export default function ChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const data = await getAllChallenges(50, 0);
        setChallenges(data);
      } catch (error) {
        console.error("Failed to load challenges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChallenges();
  }, []);

  return (
    <WoodFrame>
      <div className="min-h-screen bg-chalkboard-bg px-4 py-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          {/* Header with back button */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-chalk-white hover:text-chalk-yellow transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="chalk-text text-lg md:text-xl">홈으로</span>
            </button>
          </div>

          {/* Page title */}
          <h1 className="chalk-text mb-12 text-center text-3xl md:text-5xl font-bold text-chalk-white">
            공개된 챌린지
          </h1>

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="chalk-text text-chalk-white text-xl animate-pulse">
                로딩 중...
              </p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && challenges.length === 0 && (
            <div className="text-center py-12">
              <p className="chalk-text text-chalk-white text-xl">
                아직 공개된 챌린지가 없습니다.
              </p>
              <p className="text-chalk-white/60 mt-2">
                첫 번째 챌린지를 만들어보세요!
              </p>
            </div>
          )}

          {/* Challenge grid */}
          {!isLoading && challenges.length > 0 && (
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
          )}
        </div>
      </div>
    </WoodFrame>
  );
}
