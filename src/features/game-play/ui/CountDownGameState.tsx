import { useEffect, useState } from "react";
import type { DatabaseChallenge } from "@/entities/challenge";

interface CountDownGameStateProps {
	onCountdownEnd: () => void;
	initialCount?: number;
	challengeData: DatabaseChallenge;
}

const CountDownGameState = ({
	onCountdownEnd,
	initialCount = 3,
	challengeData,
}: CountDownGameStateProps) => {
	const [countdown, setCountdown] = useState(initialCount);

	// Preload images during countdown (matches unoptimized prop in PlayingGameStage)
	useEffect(() => {
		// Extract all unique image paths from all rounds
		const imagePaths = new Set<string>();
		challengeData.game_config?.forEach((round) => {
			round.slots?.forEach((slot) => {
				if (slot.imagePath) {
					imagePaths.add(slot.imagePath);
				}
			});
		});

		const imageArray = Array.from(imagePaths);

		// Preload unoptimized images (raw URLs without Next.js optimization)
		imageArray.forEach((imagePath) => {
			const link = document.createElement("link");
			link.rel = "preload";
			link.as = "image";
			link.href = imagePath; // Use original URL directly
			document.head.appendChild(link);
		});

		// Cleanup on unmount
		return () => {
			imageArray.forEach((imagePath) => {
				const links = document.querySelectorAll(
					`link[rel="preload"][href="${imagePath}"]`,
				);
				links.forEach((link) => link.remove());
			});
		};
	}, [challengeData]);

	useEffect(() => {
		// 카운트가 0이 되면 다음 단계로 이동
		if (countdown === 0) {
			onCountdownEnd();
			return;
		}

		// 1초마다 카운트 감소
		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		// 클린업: 컴포넌트 언마운트 시 타이머 정리
		return () => clearInterval(timer);
	}, [countdown, onCountdownEnd]);

	return (
		<div className="flex items-center justify-center h-full p-4 md:p-6">
			<p className="chalk-text text-chalk-yellow text-7xl md:text-8xl lg:text-9xl font-bold animate-pulse">
				{countdown}
			</p>
		</div>
	);
};

export default CountDownGameState;
