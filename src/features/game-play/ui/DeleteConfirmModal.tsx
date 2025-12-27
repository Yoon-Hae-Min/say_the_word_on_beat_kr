"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getUserId } from "@/shared/lib/user/fingerprint";
import { ChalkButton } from "@/shared/ui";

interface DeleteConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	challengeId: string;
	challengeTitle: string;
}

export default function DeleteConfirmModal({
	isOpen,
	onClose,
	challengeId,
	challengeTitle,
}: DeleteConfirmModalProps) {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!isOpen) return null;

	const handleDelete = async () => {
		setIsDeleting(true);
		setError(null);

		try {
			const userId = getUserId();
			const response = await fetch(`/api/admin/challenges/${challengeId}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "삭제에 실패했습니다");
			}

			router.push("/challenges");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다",
			);
			setIsDeleting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				role="button"
				tabIndex={-1}
				className="absolute inset-0 bg-black/50"
				onClick={!isDeleting ? onClose : undefined}
				onKeyDown={(e) => e.key === "Escape" && !isDeleting && onClose()}
				aria-label="모달 닫기"
			/>

			<div className="relative z-10 w-full max-w-md animate-fade-in rounded-lg bg-chalkboard-bg p-8 shadow-2xl">
				<button
					type="button"
					onClick={onClose}
					disabled={isDeleting}
					className="absolute right-4 top-4 text-chalk-white transition-colors hover:text-chalk-yellow disabled:opacity-50"
				>
					<X size={24} />
				</button>

				<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-yellow">
					챌린지 삭제
				</h2>

				<div className="mb-6 space-y-3">
					<p className="text-lg text-chalk-white">정말 삭제하시겠습니까?</p>
					<p className="text-sm text-chalk-white/70">"{challengeTitle}"</p>
					<p className="text-sm text-chalk-white/70">
						삭제된 챌린지는 복구할 수 없습니다.
					</p>
				</div>

				{error && (
					<div className="mb-4 rounded-md border-2 border-red-500 bg-red-500/20 p-3">
						<p className="text-sm text-chalk-white">{error}</p>
					</div>
				)}

				<div className="flex gap-3">
					<ChalkButton
						variant="white"
						onClick={onClose}
						disabled={isDeleting}
						className="flex-1"
					>
						취소
					</ChalkButton>
					<ChalkButton
						variant="yellow"
						onClick={handleDelete}
						disabled={isDeleting}
						className="flex-1"
					>
						{isDeleting ? "삭제 중..." : "삭제"}
					</ChalkButton>
				</div>
			</div>
		</div>
	);
}
