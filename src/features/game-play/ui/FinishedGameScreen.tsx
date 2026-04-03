/**
 * FinishedGameScreen Component
 *
 * Screen displayed when the game is completed.
 * Extracted from GameStage to follow Single Responsibility Principle.
 */

"use client";

import { ChevronRight, RotateCcw, Share2, Trophy } from "lucide-react";
import Link from "next/link";
import type { ClientSafeChallenge } from "@/entities/challenge";
import { convertImagePathToUrl } from "@/entities/challenge";
import {
	trackBrowseOtherClick,
	trackGameReplay,
	trackShareClick,
	trackShareComplete,
} from "@/shared/lib/analytics/gtag";
import { appendUtmParams, shareChallenge } from "@/shared/lib/share/shareUtils";
import { ChalkButton, ChalkDust } from "@/shared/ui";
import KakaoAdFit from "@/shared/ui/KakaoAdFit";
import SurveyBanner from "@/shared/ui/SurveyBanner";

interface FinishedGameScreenProps {
	title: string;
	challengeId: string;
	challengeData: Pick<ClientSafeChallenge, "thumbnail_url" | "game_config">;
	viewCount?: number;
	onRestart: () => void;
	votingSlot?: React.ReactNode;
	className?: string;
}

export default function FinishedGameScreen({
	title,
	challengeId,
	challengeData,
	viewCount,
	onRestart,
	votingSlot,
	className = "",
}: FinishedGameScreenProps) {
	const STAGGER_MS = 80;
	const baseUrl = typeof window !== "undefined" ? window.location.href : "";
	const shareUrl = baseUrl
		? appendUtmParams(baseUrl, {
				source: "share",
				medium: "social",
				campaign: "challenge_complete",
			})
		: "";
	const thumbnailUrl = convertImagePathToUrl(challengeData);

	const handleShare = async () => {
		trackShareClick(challengeId, "native_share");
		try {
			await shareChallenge(title, `"${title}" 챌린지를 완료했어요!`, shareUrl);
			trackShareComplete(challengeId, "web_share_api", "play_complete");
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes("클립보드")) {
					trackShareComplete(challengeId, "clipboard", "play_complete");
				}
				alert(error.message);
			}
		}
	};

	const handleRestart = () => {
		trackGameReplay(challengeId);
		onRestart();
	};

	return (
		<div className={`relative h-full p-4 md:p-6 ${className}`}>
			{/* Celebration particles */}
			<ChalkDust position="top-right" intensity="low" color="yellow" />
			<ChalkDust position="bottom-left" intensity="low" color="blue" />

			<div className="mx-auto flex h-full max-w-5xl flex-col gap-6 lg:flex-row lg:gap-8">
				{/* Left Section: Result */}
				<div className="flex flex-1 flex-col gap-6">
					{/* Celebration heading */}
					<div
						className="animate-fade-in flex flex-col items-center gap-3 text-center"
						style={{ animationFillMode: "both" }}
					>
						<Trophy className="text-chalk-yellow" size={48} />
						<p className="chalk-text text-2xl font-bold text-chalk-yellow md:text-3xl">
							모든 라운드 완료!
						</p>
					</div>

					{/* Thumbnail */}
					{thumbnailUrl && thumbnailUrl !== "/placeholder.svg" && (
						<div
							className="animate-fade-in mx-auto w-full max-w-sm overflow-hidden rounded-lg"
							style={{ animationDelay: `${STAGGER_MS}ms`, animationFillMode: "both" }}
						>
							<img src={thumbnailUrl} alt={title} className="h-auto w-full object-cover" />
						</div>
					)}

					{/* Difficulty Voting */}
					{votingSlot && (
						<div
							className="animate-fade-in w-full"
							style={{ animationDelay: `${STAGGER_MS * 2}ms`, animationFillMode: "both" }}
						>
							{votingSlot}
						</div>
					)}
				</div>

				{/* Right Section: Actions */}
				<div
					className="animate-fade-in flex w-full flex-col items-center justify-center gap-4 lg:w-80"
					style={{ animationDelay: `${STAGGER_MS * 3}ms`, animationFillMode: "both" }}
				>
					{/* Social proof — speech bubble above share button */}
					{viewCount != null && viewCount > 0 && (
						<div className="relative mx-auto w-fit rounded-lg bg-chalk-white/10 px-4 py-2">
							<p className="text-sm text-chalk-white/70">
								{viewCount.toLocaleString("ko-KR")}명이 플레이했어요
							</p>
							{/* Bubble arrow pointing down */}
							<div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[8px] border-x-transparent border-t-chalk-white/10" />
						</div>
					)}

					{/* Primary CTA: Share */}
					<ChalkButton
						variant="yellow"
						onClick={handleShare}
						className="flex w-full items-center justify-center gap-2 px-6 py-3 text-lg"
					>
						<Share2 size={20} />
						공유하기
					</ChalkButton>

					{/* Divider on mobile */}
					<div className="my-1 h-px w-full bg-chalk-white/10 lg:hidden" />

					{/* Secondary: Replay */}
					<ChalkButton
						variant="white-outline"
						onClick={handleRestart}
						className="flex w-full items-center justify-center gap-2 px-6 py-3 text-lg"
					>
						<RotateCcw size={18} />
						처음부터 다시하기
					</ChalkButton>

					{/* Tertiary: Browse */}
					<Link
						href="/challenges"
						onClick={() => trackBrowseOtherClick(challengeId)}
						className="flex min-h-[44px] items-center gap-1 text-sm text-chalk-white/60 transition-colors hover:text-chalk-yellow"
					>
						다른 챌린지 구경하기
						<ChevronRight size={16} />
					</Link>

					{/* Survey Banner */}
					<SurveyBanner />

					{/* Ad */}
					<KakaoAdFit adUnitId="DAN-0Z0d3HpqLriPjqaA" adWidth={320} adHeight={50} />
				</div>
			</div>
		</div>
	);
}
