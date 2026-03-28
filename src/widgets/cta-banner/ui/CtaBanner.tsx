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
		<section className="px-4 py-32">
			{/* Chalk divider lines */}
			<div className="mx-auto mb-10 flex max-w-md items-center gap-4">
				<div className="h-px flex-1 bg-chalk-white/15" />
				<span className="text-sm text-chalk-white/30">✦</span>
				<div className="h-px flex-1 bg-chalk-white/15" />
			</div>

			<div className="mx-auto max-w-2xl text-center">
				<p className="mb-2 text-sm text-chalk-yellow md:text-base">아직 만들어보지 않았다면</p>
				<h2 className="chalk-text mb-6 text-3xl font-bold text-chalk-white md:text-4xl">
					나만의 챌린지를 만들어보세요
				</h2>
				<div className="flex flex-col items-center gap-3">
					<ChalkButton variant="yellow" onClick={handleClick} className="text-lg md:text-xl">
						지금 만들기
					</ChalkButton>
					<span className="text-xs text-chalk-white/40">이미지만 올리면 1분 안에 완성</span>
				</div>
			</div>

			<ChallengeStart isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</section>
	);
}
