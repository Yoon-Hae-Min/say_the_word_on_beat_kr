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
  const [currentRound, setCurrentRound] = useState(1);
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle");

  const gameConfig = challengeData.game_config ?? [];
  const totalRounds = gameConfig.length;
  const isLastRound = currentRound === totalRounds;

  // 처음부터 다시 시작
  const resetGame = () => {
    setCurrentRound(1);
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
      />
    );
  }

  if (gamePhase === "playing") {
    return <PlayingGameStage challengeData={challengeData} />;
  }

  // Playing / Finished 화면
  return (
    <div className="flex items-center justify-center h-full p-4 md:p-6">
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
  );
}
