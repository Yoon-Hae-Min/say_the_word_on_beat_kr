/**
 * GameDecorations Component
 *
 * Decorative elements for the game screen (speaker and question mark).
 * Extracted from PlayingGameStage to follow Single Responsibility Principle.
 */

import Image from "next/image";

/**
 * Decorative elements displayed during game play
 *
 * Includes animated speaker and question mark icons fixed to screen corners.
 */
export default function GameDecorations() {
	return (
		<>
			{/* 좌측 상단 - loud-speaker (전체 화면 기준 고정) */}
			<div className="fixed top-5 left-4 md:top-8 md:left-8 w-12 h-12 md:w-32 md:h-32 animate-wiggle-1 z-10">
				<Image
					src="/loud-speaker.png"
					alt="loud-speaker"
					fill
					className="object-cover opacity-80"
				/>
			</div>

			{/* 우측 상단 - question (전체 화면 기준 고정) */}
			<div className="fixed top-5 right-4 md:top-8 md:right-8 w-10 h-10 md:w-32 md:h-32 animate-wiggle-2 z-10">
				<Image src="/question.png" alt="question" fill className="object-cover opacity-80" />
			</div>
		</>
	);
}
