"use client";

import Image from "next/image";
import { useState } from "react";
import type { DatabaseChallenge } from "@/entities/challenge";
import { ChalkButton } from "@/shared/ui";
import CountDownGameState from "./CountDownGameState";
import GameNavigationBar from "./GameNavigationBar";
import IdleGameStage from "./IdleGameStage";
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

	// Finished 화면 Share handler
	const shareUrl = typeof window !== "undefined" ? window.location.href : "";

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
		<>
			{/* Navigation Bar - Fixed across all phases */}
			<GameNavigationBar challengeData={challengeData} />

			{/* Idle 화면 */}
			{gamePhase === "idle" && (
				<IdleGameStage
					challengeData={challengeData}
					onStartClick={() => {
						setGamePhase("countdown");
					}}
				/>
			)}

			{/* Countdown 화면 */}
			{gamePhase === "countdown" && (
				<CountDownGameState
					onCountdownEnd={() => {
						setGamePhase("playing");
					}}
					initialCount={3}
					challengeData={challengeData}
				/>
			)}

			{/* Playing 화면 */}
			{gamePhase === "playing" && (
				<PlayingGameStage
					challengeData={challengeData}
					onPlayingEnd={() => {
						setGamePhase("finished");
					}}
				/>
			)}

			{/* Finished 화면 */}
			{gamePhase === "finished" && (
				<div className="flex h-full items-center justify-center p-4 md:p-6">
					<div className="space-y-6 text-center">
						<p className="chalk-text text-xl text-chalk-yellow md:text-2xl">
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
								<ChalkButton variant="white" className="w-full px-6 py-3 text-lg">
									다른 챌린지 구경하기
								</ChalkButton>
							</a>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
