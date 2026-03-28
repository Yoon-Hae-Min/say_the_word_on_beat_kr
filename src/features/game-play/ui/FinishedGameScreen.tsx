/**
 * FinishedGameScreen Component
 *
 * Screen displayed when the game is completed.
 * Extracted from GameStage to follow Single Responsibility Principle.
 */

"use client";

import Link from "next/link";
import type { ClientSafeChallenge } from "@/entities/challenge";
import { convertImagePathToUrl } from "@/entities/challenge";
import { shareChallenge } from "@/shared/lib/share/shareUtils";
import { ChalkButton } from "@/shared/ui";

interface FinishedGameScreenProps {
	/**
	 * Challenge title
	 */
	title: string;

	/**
	 * Challenge ID for voting
	 */
	challengeId: string;

	/**
	 * Challenge data for thumbnail
	 */
	challengeData: Pick<ClientSafeChallenge, "thumbnail_url" | "game_config">;

	/**
	 * Callback to restart the game
	 */
	onRestart: () => void;

	/**
	 * Slot for difficulty voting UI (injected from parent to avoid cross-feature import)
	 */
	votingSlot?: React.ReactNode;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Finished game screen with restart, share, and voting options
 *
 * @example
 * ```tsx
 * <FinishedGameScreen
 *   title="Challenge Title"
 *   challengeId="abc-123"
 *   onRestart={() => setGamePhase('idle')}
 * />
 * ```
 */
export default function FinishedGameScreen({
	title,
	challengeId,
	challengeData,
	onRestart,
	votingSlot,
	className = "",
}: FinishedGameScreenProps) {
	const shareUrl = typeof window !== "undefined" ? window.location.href : "";
	const thumbnailUrl = convertImagePathToUrl(challengeData);

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
		<div className={`h-full p-4 md:p-6 ${className}`}>
			<div className="flex h-full flex-col gap-6 lg:flex-row lg:gap-8 max-w-5xl mx-auto">
				{/* Left Section: Thumbnail + Voting */}
				<div className="flex flex-1 flex-col gap-6">
					<p className="chalk-text text-center text-xl text-chalk-yellow md:text-2xl">
						모든 라운드 완료! 🎉
					</p>

					{/* Thumbnail */}
					{thumbnailUrl && thumbnailUrl !== "/placeholder.svg" && (
						<div className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border-4 border-chalk-white/20">
							<img src={thumbnailUrl} alt={title} className="h-auto w-full object-cover" />
						</div>
					)}

					{/* Difficulty Voting */}
					{votingSlot && <div className="w-full">{votingSlot}</div>}
				</div>

				{/* Right Section: Action Buttons */}
				<div className="flex w-full flex-col items-center justify-center gap-4 lg:w-80">
					<ChalkButton
						variant="white-outline"
						onClick={onRestart}
						className="w-full px-6 py-3 text-lg"
					>
						처음부터 다시하기
					</ChalkButton>

					<ChalkButton
						variant="white-outline"
						onClick={handleShare}
						className="w-full px-6 py-3 text-lg"
					>
						공유하기
					</ChalkButton>

					<Link href="/challenges" className="w-full">
						<ChalkButton variant="white-outline" className="w-full px-6 py-3 text-lg">
							다른 챌린지 구경하기
						</ChalkButton>
					</Link>
				</div>
			</div>
		</div>
	);
}
