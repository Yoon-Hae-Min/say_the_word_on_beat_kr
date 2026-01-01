"use client";

import { Globe, Home, Lock, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ClientSafeChallenge } from "@/entities/challenge";
import { updateChallengePublicStatus } from "@/entities/challenge/api/repository";
import { getUserId } from "@/shared/lib/user/fingerprint";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface GameNavigationBarProps {
	challengeData: ClientSafeChallenge;
}

export default function GameNavigationBar({ challengeData }: GameNavigationBarProps) {
	const router = useRouter();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isPublic, setIsPublic] = useState(challengeData.is_public);
	const [isUpdating, setIsUpdating] = useState(false);

	const handleTogglePublic = async () => {
		if (isUpdating) return;

		try {
			setIsUpdating(true);
			const userId = getUserId();
			const newStatus = !isPublic;
			await updateChallengePublicStatus(challengeData.id, userId, newStatus);
			setIsPublic(newStatus);
		} catch (error) {
			console.error("Failed to update public status:", error);
			alert(error instanceof Error ? error.message : "공개/비공개 설정 변경에 실패했습니다.");
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<>
			<div className="fixed left-6 top-6 z-50 flex gap-3 md:left-8 md:top-8">
				{/* Home Button */}
				<button
					type="button"
					onClick={() => router.push("/challenges")}
					className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-chalk-white bg-transparent transition-all hover:scale-105 hover:bg-chalk-white/10 md:h-14 md:w-14"
					aria-label="챌린지 목록으로"
				>
					<Home className="h-6 w-6 text-chalk-white md:h-7 md:w-7" />
				</button>

				{/* Public/Private Toggle Button - Only visible to owner */}
				{challengeData.isMine && (
					<button
						type="button"
						onClick={handleTogglePublic}
						disabled={isUpdating}
						className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition-all hover:scale-105 md:h-14 md:w-14 ${
							isPublic
								? "border-chalk-white bg-transparent hover:bg-chalk-white/10"
								: "border-chalk-yellow bg-transparent hover:bg-chalk-yellow/10"
						} ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
						aria-label={isPublic ? "비공개로 변경" : "공개로 변경"}
					>
						{isPublic ? (
							<Globe className="h-6 w-6 text-chalk-white md:h-7 md:w-7" />
						) : (
							<Lock className="h-6 w-6 text-chalk-yellow md:h-7 md:w-7" />
						)}
					</button>
				)}

				{/* Delete Button - Only visible to challenge owner */}
				{challengeData.isMine && (
					<button
						type="button"
						onClick={() => setIsDeleteModalOpen(true)}
						className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-red-500 bg-transparent transition-all hover:scale-105 hover:bg-red-500/20 md:h-14 md:w-14"
						aria-label="챌린지 삭제"
					>
						<Trash2 className="h-6 w-6 text-red-500 md:h-7 md:w-7" />
					</button>
				)}
			</div>

			<DeleteConfirmModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				challengeId={challengeData.id}
				challengeTitle={challengeData.title}
			/>
		</>
	);
}
