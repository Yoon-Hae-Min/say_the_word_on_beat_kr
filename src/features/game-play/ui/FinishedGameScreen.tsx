/**
 * FinishedGameScreen Component
 *
 * Screen displayed when the game is completed.
 * Extracted from GameStage to follow Single Responsibility Principle.
 */

"use client";

import { shareChallenge } from "@/shared/lib/share/shareUtils";
import { ChalkButton } from "@/shared/ui";

interface FinishedGameScreenProps {
	/**
	 * Challenge title
	 */
	title: string;

	/**
	 * Callback to restart the game
	 */
	onRestart: () => void;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Finished game screen with restart and share options
 *
 * @example
 * ```tsx
 * <FinishedGameScreen
 *   title="Challenge Title"
 *   onRestart={() => setGamePhase('idle')}
 * />
 * ```
 */
export default function FinishedGameScreen({
	title,
	onRestart,
	className = "",
}: FinishedGameScreenProps) {
	const shareUrl = typeof window !== "undefined" ? window.location.href : "";

	const handleShare = async () => {
		try {
			await shareChallenge(title, `"${title}" 챌린지를 완료했어요!`, shareUrl);
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	};

	return (
		<div className={`flex h-full items-center justify-center p-4 md:p-6 ${className}`}>
			<div className="space-y-6 text-center">
				<p className="chalk-text text-xl text-chalk-yellow md:text-2xl">모든 라운드 완료! 🎉</p>

				<div className="flex flex-col gap-3">
					<ChalkButton variant="yellow" onClick={onRestart} className="px-6 py-3 text-lg">
						처음부터 다시하기
					</ChalkButton>

					<ChalkButton variant="blue" onClick={handleShare} className="px-6 py-3 text-lg">
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
	);
}
