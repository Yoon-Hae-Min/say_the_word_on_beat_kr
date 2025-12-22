"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ChallengeData } from "@/entities/challenge";
import { ChalkButton } from "@/shared/ui";

interface GameStageProps {
  challengeData: ChallengeData;
}

type GamePhase = "idle" | "preview" | "playing" | "finished";

const PREVIEW_DURATION = 5000; // 5 seconds to preview
const BEAT_INTERVAL = 500; // 500ms per beat

export default function GameStage({ challengeData }: GameStageProps) {
  const [currentRound, setCurrentRound] = useState(1);
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const TOTAL_ROUNDS = challengeData.rounds.length;
  const currentSlots = challengeData.rounds[currentRound - 1]?.slots || [];

  const handleStart = () => {
    setGamePhase("preview");
    setFocusedIndex(null);

    // After preview, start the beat
    setTimeout(() => {
      setGamePhase("playing");
      startBeating();
    }, PREVIEW_DURATION);
  };

  const startBeating = () => {
    let index = 0;

    const interval = setInterval(() => {
      if (index < currentSlots.length) {
        setFocusedIndex(index);
        index++;
      } else {
        clearInterval(interval);
        setFocusedIndex(null);
        setGamePhase("finished");
      }
    }, BEAT_INTERVAL);

    return () => clearInterval(interval);
  };

  const handleNextRound = () => {
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(currentRound + 1);
      setGamePhase("idle");
      setFocusedIndex(null);
    }
  };

  const handlePreviousRound = () => {
    if (currentRound > 1) {
      setCurrentRound(currentRound - 1);
      setGamePhase("idle");
      setFocusedIndex(null);
    }
  };

  const handleReplay = () => {
    setGamePhase("idle");
    setFocusedIndex(null);
  };

  const getResourceById = (resourceId: string | null) => {
    if (!resourceId) return null;
    return challengeData.resources.find((r) => r.id === resourceId);
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Title and Round Info */}
      <div className="text-center mb-8">
        <h1 className="chalk-text text-chalk-yellow text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {challengeData.title}
        </h1>
        <p className="chalk-text text-chalk-white text-xl md:text-2xl">
          라운드 {currentRound} / {TOTAL_ROUNDS}
        </p>
      </div>

      {/* Game Grid */}
      <div className="border-2 border-dashed border-chalk-blue/50 bg-chalkboard-bg/50 rounded-md p-6 lg:p-8 mb-8">
        {gamePhase === "preview" && (
          <p className="text-chalk-yellow text-center text-xl mb-4 chalk-text animate-pulse">
            미리보기... 단어를 기억하세요!
          </p>
        )}
        {gamePhase === "playing" && (
          <p className="text-chalk-yellow text-center text-xl mb-4 chalk-text animate-pulse">
            비트에 맞춰 단어를 외치세요!
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentSlots.map((slot, index) => {
            const resource = getResourceById(slot.resourceId);
            const isFocused = focusedIndex === index && gamePhase === "playing";

            return (
              <div
                key={index}
                className={`
                  relative aspect-square rounded-md overflow-hidden
                  transition-all duration-300
                  ${
                    resource
                      ? `border-4 ${
                          isFocused
                            ? "border-chalk-yellow scale-110 brightness-125 shadow-lg shadow-chalk-yellow/50"
                            : "border-chalk-white"
                        }`
                      : "border-2 border-dashed border-chalk-white/50"
                  }
                `}
              >
                {resource ? (
                  <>
                    <Image
                      src={resource.imageUrl}
                      alt={resource.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {gamePhase !== "idle" && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                        <p className="chalk-text text-chalk-yellow text-center text-sm md:text-base font-bold truncate">
                          {resource.name}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-chalk-white/50 text-xs">비어있음</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        {gamePhase === "idle" && (
          <ChalkButton
            variant="yellow"
            onClick={handleStart}
            className="px-8 py-4 text-xl"
          >
            시작하기
          </ChalkButton>
        )}

        {gamePhase === "finished" && (
          <>
            <ChalkButton
              variant="blue"
              onClick={handleReplay}
              className="px-8 py-4 text-xl"
            >
              다시하기
            </ChalkButton>
            {currentRound < TOTAL_ROUNDS && (
              <ChalkButton
                variant="yellow"
                onClick={handleNextRound}
                className="px-8 py-4 text-xl"
              >
                다음 라운드
              </ChalkButton>
            )}
          </>
        )}

        {gamePhase === "finished" && currentRound === TOTAL_ROUNDS && (
          <div className="text-center mt-4">
            <p className="chalk-text text-chalk-yellow text-2xl mb-4">
              모든 라운드 완료! 🎉
            </p>
            <a
              href="/"
              className="text-chalk-white hover:text-chalk-yellow underline text-lg"
            >
              홈으로 돌아가기
            </a>
          </div>
        )}
      </div>

      {/* Round Navigation */}
      {gamePhase === "idle" && (
        <div className="flex justify-center gap-4 mt-8">
          <ChalkButton
            variant="white"
            onClick={handlePreviousRound}
            disabled={currentRound === 1}
            className="px-6 py-2"
          >
            이전 라운드
          </ChalkButton>
          <ChalkButton
            variant="white"
            onClick={handleNextRound}
            disabled={currentRound === TOTAL_ROUNDS}
            className="px-6 py-2"
          >
            다음 라운드
          </ChalkButton>
        </div>
      )}
    </div>
  );
}
