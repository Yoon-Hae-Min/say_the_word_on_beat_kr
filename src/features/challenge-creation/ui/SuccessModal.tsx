"use client";

import { Copy, Play, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChalkButton } from "@/shared/ui";

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	challengeId: string;
	thumbnail: string;
}

export default function SuccessModal({
	isOpen,
	onClose,
	challengeId,
	thumbnail,
}: SuccessModalProps) {
	const router = useRouter();
	const [copied, setCopied] = useState(false);

	if (!isOpen) return null;

	const handleCopyLink = () => {
		const url = `${window.location.origin}/play/${challengeId}`;
		navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handlePlay = () => {
		router.push(`/play/${challengeId}`);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Overlay */}
			<div
				role="button"
				tabIndex={-1}
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Escape" && onClose()}
				aria-label="모달 닫기"
			/>

			{/* Modal */}
			<div className="relative z-10 w-full max-w-md animate-fade-in rounded-lg bg-chalkboard-bg p-8 shadow-2xl chalk-border border-chalk-yellow">
				{/* Close button */}
				<button
					type="button"
					onClick={onClose}
					className="absolute right-4 top-4 text-chalk-white transition-colors hover:text-chalk-yellow"
					aria-label="닫기"
				>
					<X size={24} />
				</button>

				{/* Title */}
				<h2 className="chalk-text mb-6 text-3xl font-bold text-chalk-yellow text-center">
					챌린지 완성!
				</h2>

				{/* Thumbnail */}
				<div className="relative mb-6 aspect-video rounded-md overflow-hidden border-4 border-chalk-white">
					<Image src={thumbnail} alt="챌린지 썸네일" fill className="object-cover" sizes="400px" />
				</div>

				{/* Challenge ID */}
				<p className="text-chalk-white/70 text-center text-sm mb-6">
					챌린지 ID: {challengeId.slice(0, 8)}...
				</p>

				{/* Actions */}
				<div className="space-y-3">
					<ChalkButton
						variant="yellow"
						onClick={handleCopyLink}
						className="w-full flex items-center justify-center gap-2"
					>
						<Copy size={20} />
						{copied ? "복사됨!" : "링크 복사"}
					</ChalkButton>

					<ChalkButton
						variant="blue"
						onClick={handlePlay}
						className="w-full flex items-center justify-center gap-2"
					>
						<Play size={20} />
						바로 플레이
					</ChalkButton>
				</div>
			</div>
		</div>
	);
}
