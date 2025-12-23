"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { ChallengeData } from "@/entities/challenge";
import { ChalkButton } from "@/shared/ui";
import IdleGameStage from "./IdleGameStage";
import CountDownGameState from "./CountDownGameState";

interface GameStageProps {
  challengeData: ChallengeData;
}

type GamePhase = "idle" | "countdown" | "playing" | "finished";

const BEAT_INTERVAL = 500;
const BEAT_REPEATS = 2;

export default function GameStage({ challengeData }: GameStageProps) {
  const [currentRound, setCurrentRound] = useState(1);
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalRounds = challengeData.rounds.length;
  const currentSlots = challengeData.rounds[currentRound - 1]?.slots || [];
  const isLastRound = currentRound === totalRounds;

  // 오디오 초기화
  useEffect(() => {
    if (challengeData.songUrl) {
      audioRef.current = new Audio(challengeData.songUrl);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [challengeData.songUrl]);

  // 비트 실행
  const startBeating = () => {
    let slotIndex = 0;
    let cycleCount = 0;

    const beatTimer = setInterval(() => {
      if (slotIndex < currentSlots.length) {
        setFocusedIndex(slotIndex);
        slotIndex++;
      } else {
        cycleCount++;

        if (cycleCount < BEAT_REPEATS) {
          slotIndex = 0;
          setFocusedIndex(null);
        } else {
          clearInterval(beatTimer);
          setFocusedIndex(null);
          setGamePhase("finished");

          // 마지막 라운드면 음악 정지
          if (isLastRound && audioRef.current) {
            audioRef.current.pause();
          }

          if (!isLastRound) {
            setTimeout(() => moveToNextRound(), 2000);
          }
        }
      }
    }, BEAT_INTERVAL);
  };

  // 다음 라운드로 이동
  const moveToNextRound = () => {
    setCurrentRound((prev) => prev + 1);
    setFocusedIndex(null);
    setTimeout(() => {
      setGamePhase("playing");
      startBeating();
    }, 1000);
  };

  // 처음부터 다시 시작
  const resetGame = () => {
    setCurrentRound(1);
    setGamePhase("idle");
    setFocusedIndex(null);
    // 음악 정지 및 초기화
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const getResource = (resourceId: string | null) => {
    if (!resourceId) return null;
    return challengeData.resources.find((r) => r.id === resourceId);
  };

  // Idle 화면
  if (gamePhase === "idle") {
    return (
      <IdleGameStage
        challengeData={challengeData}
        onStartClick={() => {
          setGamePhase("countdown");
        }}
      />
    );
  }

  // Countdown 화면
  if (gamePhase === "countdown") {
    return (
      <CountDownGameState
        onCountdownEnd={() => {
          setGamePhase("playing");
        }}
        initialCount={3}
      />
    );
  }

  // if(gamePhase === "playing"){
  //   return(

  //   )
  // }

  // Playing / Finished 화면
  return (
    <div className="flex items-center justify-center h-full p-4 md:p-6">
      <div className="w-full max-w-4xl space-y-4">
        {/* 라운드 표시 */}
        <p className="chalk-text text-chalk-white text-lg md:text-xl text-center">
          라운드 {currentRound} / {totalRounds}
        </p>

        {/* 게임 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
          {currentSlots.map((slot, index) => {
            const resource = getResource(slot.resourceId);
            const isFocused = focusedIndex === index && gamePhase === "playing";

            return (
              <div
                key={index}
                className={`
                  relative aspect-square rounded-md overflow-hidden transition-all duration-300
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

        {/* 완료 화면 */}
        {gamePhase === "finished" && isLastRound && (
          <div className="text-center mt-6">
            <p className="chalk-text text-chalk-yellow text-xl md:text-2xl mb-4">
              모든 라운드 완료! 🎉
            </p>
            <ChalkButton
              variant="blue"
              onClick={resetGame}
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
    </div>
  );
}
