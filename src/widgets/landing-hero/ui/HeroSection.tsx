"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePublicChallengesCount, useTotalPlayCount } from "@/entities/challenge";
import { ChallengeStart } from "@/features/challenge-start";
import { sendGAEvent } from "@/shared/lib/analytics/gtag";
import { ChalkButton, ChalkDust } from "@/shared/ui";

function formatNumber(num: number): string {
	if (num >= 10000) {
		return `${(num / 10000).toFixed(1)}만`;
	}
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1)}천`;
	}
	return num.toLocaleString("ko-KR");
}

export default function HeroSection() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();
	const { data: challengeCount = 0, isLoading: isCountLoading } = usePublicChallengesCount();
	const { data: totalPlayCount = 0, isLoading: isPlayCountLoading } = useTotalPlayCount();

	const handleCreateClick = () => {
		sendGAEvent({
			action: "hero_cta_click",
			category: "landing",
			label: "create",
		});
		setIsModalOpen(true);
	};

	const handlePlayClick = () => {
		sendGAEvent({
			action: "hero_cta_click",
			category: "landing",
			label: "play",
		});
		router.push("/challenges");
	};

	return (
		<section className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 py-32">
			{/* Decorative chalk dust particles */}
			<ChalkDust position="top-right" intensity="low" color="blue" />
			<ChalkDust position="bottom-left" intensity="low" color="white" />

			{/* Main content */}
			<div className="animate-fade-in text-center">
				{/* Title with gradient-like effect using multiple colors */}
				<h1 className="chalk-text mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
					<span className="text-chalk-yellow">단어</span>
					<span className="text-chalk-white">리듬</span>
					<span className="text-chalk-blue">게임</span>
				</h1>

				{/* Subtitle */}
				<p className="chalk-text mb-6 text-xl text-chalk-white md:text-2xl lg:text-3xl">
					Say The Word On Beat
				</p>

				{/* Social Proof Stats */}
				<div
					className="animate-fade-in mx-auto mb-8 flex max-w-md items-center justify-center gap-8 md:gap-12"
					style={{ animationDelay: "0.3s", animationFillMode: "both" }}
				>
					<div className="text-center">
						<p className="chalk-text text-3xl font-bold text-chalk-yellow md:text-4xl">
							{isCountLoading ? "-" : formatNumber(challengeCount)}
						</p>
						<p className="chalk-text mt-1 text-sm text-chalk-white/70 md:text-base">공개 챌린지</p>
					</div>
					<div className="h-10 w-px bg-chalk-white/30" />
					<div className="text-center">
						<p className="chalk-text text-3xl font-bold text-chalk-blue md:text-4xl">
							{isPlayCountLoading ? "-" : formatNumber(totalPlayCount)}
						</p>
						<p className="chalk-text mt-1 text-sm text-chalk-white/70 md:text-base">총 플레이 수</p>
					</div>
				</div>

				{/* CTA Buttons */}
				<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
					<ChalkButton variant="yellow" onClick={handleCreateClick} className="text-lg md:text-xl">
						나만의 게임 만들기
					</ChalkButton>
					<ChalkButton
						variant="white-outline"
						onClick={handlePlayClick}
						className="text-lg md:text-xl"
					>
						인기 챌린지 플레이
					</ChalkButton>
				</div>
			</div>

			{/* Start Modal */}
			<ChallengeStart isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</section>
	);
}
