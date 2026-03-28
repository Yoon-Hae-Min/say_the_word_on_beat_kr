"use client";

import { Globe, Home, Lock, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateChallengePublicStatus } from "@/entities/challenge";
import { getUserId } from "@/shared/lib/user/fingerprint";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface GameNavigationBarProps {
	challengeId: string;
	title: string;
	isPublic: boolean;
	isMine: boolean;
}

export default function GameNavigationBar({
	challengeId,
	title,
	isPublic: initialIsPublic,
	isMine,
}: GameNavigationBarProps) {
	const router = useRouter();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isPublic, setIsPublic] = useState(initialIsPublic);
	const [isUpdating, setIsUpdating] = useState(false);

	const handleTogglePublic = async () => {
		if (isUpdating) return;

		try {
			setIsUpdating(true);
			const userId = getUserId();
			const newStatus = !isPublic;
			await updateChallengePublicStatus(challengeId, userId, newStatus);
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
					className="flex h-12 items-center gap-2 rounded-lg border-2 border-chalk-white bg-transparent px-3 transition-all hover:scale-105 hover:bg-chalk-white/10 md:h-14 md:px-4"
					aria-label="챌린지 목록으로"
				>
					<Home className="h-5 w-5 text-chalk-white md:h-6 md:w-6" />
					<span className="chalk-text hidden text-sm text-chalk-white md:inline">목록</span>
				</button>

				{/* Public/Private Toggle Button - Only visible to owner */}
				{isMine && (
					<button
						type="button"
						onClick={handleTogglePublic}
						disabled={isUpdating}
						className={`flex h-12 items-center gap-2 rounded-lg border-2 px-3 transition-all hover:scale-105 md:h-14 md:px-4 ${
							isPublic
								? "border-chalk-white bg-transparent hover:bg-chalk-white/10"
								: "border-chalk-yellow bg-transparent hover:bg-chalk-yellow/10"
						} ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
						aria-label={isPublic ? "비공개로 변경" : "공개로 변경"}
					>
						{isPublic ? (
							<>
								<Globe className="h-5 w-5 text-chalk-white md:h-6 md:w-6" />
								<span className="chalk-text hidden text-sm text-chalk-white md:inline">공개</span>
							</>
						) : (
							<>
								<Lock className="h-5 w-5 text-chalk-yellow md:h-6 md:w-6" />
								<span className="chalk-text hidden text-sm text-chalk-yellow md:inline">비공개</span>
							</>
						)}
					</button>
				)}

				{/* Delete Button - Only visible to challenge owner */}
				{isMine && (
					<button
						type="button"
						onClick={() => setIsDeleteModalOpen(true)}
						className="flex h-12 items-center gap-2 rounded-lg border-2 border-danger bg-transparent px-3 transition-all hover:scale-105 hover:bg-danger/20 md:h-14 md:px-4"
						aria-label="챌린지 삭제"
					>
						<Trash2 className="h-5 w-5 text-danger md:h-6 md:w-6" />
						<span className="chalk-text hidden text-sm text-danger md:inline">삭제</span>
					</button>
				)}
			</div>

			<DeleteConfirmModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				challengeId={challengeId}
				challengeTitle={title}
			/>
		</>
	);
}
