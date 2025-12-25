"use client";

import { useState } from "react";
import Image from "next/image";
import type { DatabaseChallenge } from "@/entities/challenge";
import { ChalkButton } from "@/shared/ui";
import IdleGameStage from "./IdleGameStage";
import CountDownGameState from "./CountDownGameState";
import PlayingGameStage from "./PlayingGameStage";

interface GameStageProps {
  challengeData: DatabaseChallenge;
}

type GamePhase = "idle" | "countdown" | "playing" | "finished";

export default function GameStage({ challengeData }: GameStageProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle");

  // 처음부터 다시 시작
  const resetGame = () => {
    setGamePhase("idle");
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
          // startBeating();
        }}
        initialCount={3}
        challengeData={challengeData}
      />
    );
  }

  if (gamePhase === "playing") {
    return (
      <PlayingGameStage
        challengeData={challengeData}
        onPlayingEnd={() => {
          setGamePhase("finished");
        }}
      />
    );
  }

  // Finished 화면
  if (gamePhase === "finished") {
    const shareUrl = typeof window !== "undefined"
      ? window.location.href
      : "";

    const handleShare = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: challengeData.title,
            text: `"${challengeData.title}" 챌린지를 완료했어요!`,
            url: shareUrl,
          });
        } catch (err) {
          console.error("Share failed:", err);
        }
      } else {
        // 공유 API 미지원 시 URL 복사
        navigator.clipboard.writeText(shareUrl);
        alert("링크가 클립보드에 복사되었습니다!");
      }
    };

    return (
      <div className="flex items-center justify-center h-full p-4 md:p-6">
        <div className="text-center space-y-6">
          <p className="chalk-text text-chalk-yellow text-xl md:text-2xl">
            모든 라운드 완료! 🎉
          </p>

          <div className="flex flex-col gap-3">
            <ChalkButton
              variant="yellow"
              onClick={resetGame}
              className="px-6 py-3 text-lg"
            >
              처음부터 다시하기
            </ChalkButton>

            <ChalkButton
              variant="blue"
              onClick={handleShare}
              className="px-6 py-3 text-lg"
            >
              공유하기
            </ChalkButton>

            <a href="/">
              <ChalkButton
                variant="white"
                className="px-6 py-3 text-lg w-full"
              >
                홈으로 돌아가기
              </ChalkButton>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
