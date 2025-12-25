"use client";

import { useState } from "react";
import { ChallengeStart } from "@/features/challenge-start";
import { ChalkButton, ChalkDust } from "@/shared/ui";

export default function HeroSection() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-16">
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
				<p className="chalk-text mb-12 text-xl text-chalk-white md:text-2xl lg:text-3xl">
					Say The Word On Beat
				</p>

				{/* Description */}
				<p className="mx-auto mb-8 max-w-2xl text-lg text-chalk-white/90 md:text-xl">
					웹에서 누구나 쉽게 챌린지를 만들고 공유하는
					<br />
					리듬 퀴즈 플랫폼
				</p>

				{/* CTA Button */}
				<ChalkButton
					variant="yellow"
					onClick={() => setIsModalOpen(true)}
					className="text-lg md:text-xl"
				>
					나만의 단어리듬게임 만들기
				</ChalkButton>
			</div>

			{/* Start Modal */}
			<ChallengeStart isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</section>
	);
}
