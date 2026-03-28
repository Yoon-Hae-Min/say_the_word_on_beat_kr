"use client";

import { useState } from "react";
import { ChallengeStart } from "@/features/challenge-start";
import { sendGAEvent } from "@/shared/lib/analytics/gtag";
import { ChalkButton } from "@/shared/ui";

export default function CtaBanner() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleClick = () => {
		sendGAEvent({
			action: "bottom_cta_click",
			category: "landing",
			label: "create",
		});
		setIsModalOpen(true);
	};

	return (
		<section className="px-4 py-16">
			<div className="mx-auto max-w-3xl chalk-border border-chalk-yellow bg-chalkboard-bg/80 p-8 md:p-12 text-center organic-rotate-1">
				<h2 className="chalk-text text-2xl md:text-3xl font-bold text-chalk-white mb-4">
					나만의 챌린지를 만들어보세요
				</h2>
				<p className="text-chalk-white/70 mb-8 text-sm md:text-base">
					이미지만 올리면 5분 안에 완성 · 회원가입 없이 바로 시작
				</p>
				<ChalkButton variant="yellow" onClick={handleClick} className="text-lg md:text-xl">
					지금 만들기
				</ChalkButton>
			</div>
			<ChallengeStart isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</section>
	);
}
