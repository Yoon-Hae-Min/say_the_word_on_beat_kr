"use client";

import { useState } from "react";
import Image from "next/image";
import type { ChallengeData } from "@/entities/challenge";
import { ChalkButton } from "@/shared/ui";

interface GameStageProps {
  challengeData: ChallengeData;
}

type GamePhase = "idle" | "countdown" | "playing" | "finished";

const BEAT_INTERVAL = 500; // 500ms per beat
const BEAT_REPEATS = 2; // Number of times to repeat the beat sequence

export default function GameStage({ challengeData }: GameStageProps) {
  const [currentRound, setCurrentRound] = useState(1);
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(3);

  const TOTAL_ROUNDS = challengeData.rounds.length;
  const currentSlots = challengeData.rounds[currentRound - 1]?.slots || [];

  const handleStart = () => {
    setGamePhase("countdown");
    setCountdown(3);

    // Countdown: 3, 2, 1
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);

      if (count === 0) {
        clearInterval(countdownInterval);
        // Start playing immediately after countdown
        setGamePhase("playing");
        startBeating();
      }
    }, 1000);
  };

  const startBeating = () => {
    let index = 0;
    let repeatCount = 0;

    const interval = setInterval(() => {
      if (index < currentSlots.length) {
        setFocusedIndex(index);
        index++;
      } else {
        // One cycle complete
        repeatCount++;

        if (repeatCount < BEAT_REPEATS) {
          // Reset for next repeat
          index = 0;
          setFocusedIndex(null);
        } else {
          // All repeats done
          clearInterval(interval);
          setFocusedIndex(null);
          setGamePhase("finished");

          // Auto-advance to next round if not the last round
          if (currentRound < TOTAL_ROUNDS) {
            setTimeout(() => {
              handleAutoNextRound();
            }, 2000);
          }
        }
      }
    }, BEAT_INTERVAL);

    return () => clearInterval(interval);
  };

  const handleAutoNextRound = () => {
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(currentRound + 1);
      setFocusedIndex(null);

      // Start next round immediately without countdown
      setTimeout(() => {
        setGamePhase("playing");
        startBeating();
      }, 1000);
    }
  };

  const handleReplay = () => {
    setCurrentRound(1);
    setGamePhase("idle");
    setFocusedIndex(null);
  };

  const getResourceById = (resourceId: string | null) => {
    if (!resourceId) return null;
    return challengeData.resources.find((r) => r.id === resourceId);
  };

  return (
    <div className="flex items-center justify-center h-full overflow-hidden p-4 md:p-6">
      <div className="w-full max-w-4xl">
        {gamePhase === "idle" ? (
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h1 className="chalk-text text-chalk-yellow text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                "{challengeData.title}"
              </h1>
            </div>
            <ChalkButton
              variant="yellow"
              onClick={handleStart}
              className="px-8 py-4 text-xl"
            >
              시작하기
            </ChalkButton>
          </div>
        ) : gamePhase === "countdown" ? (
          <div className="text-center">
            <p className="chalk-text text-chalk-yellow text-7xl md:text-8xl lg:text-9xl font-bold animate-pulse">
              {countdown}
            </p>
          </div>
        ) : (
          // Show game grid during playing and finished phases
          <div className="space-y-4">
            <p className="chalk-text text-chalk-white text-lg md:text-xl text-center">
              라운드 {currentRound} / {TOTAL_ROUNDS}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
              {currentSlots.map((slot, index) => {
                const resource = getResourceById(slot.resourceId);
                const isFocused =
                  focusedIndex === index && gamePhase === "playing";

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
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                          <p className="chalk-text text-chalk-yellow text-center text-sm md:text-base font-bold truncate">
                            {resource.name}
                          </p>
                        </div>
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

            {gamePhase === "finished" && currentRound === TOTAL_ROUNDS && (
              <div className="text-center mt-6">
                <p className="chalk-text text-chalk-yellow text-xl md:text-2xl mb-4">
                  모든 라운드 완료! 🎉
                </p>
                <ChalkButton
                  variant="blue"
                  onClick={handleReplay}
                  className="px-6 py-3 text-lg mb-3"
                >
                  처음부터 다시하기
                </ChalkButton>
                <div className="mt-2">
                  <a
                    href="/"
                    className="text-chalk-white hover:text-chalk-yellow underline text-base"
                  >
                    홈으로 돌아가기
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
