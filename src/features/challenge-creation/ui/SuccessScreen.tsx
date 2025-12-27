"use client";

import { Copy, Play } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChalkButton } from "@/shared/ui";

interface SuccessScreenProps {
	challengeId: string;
	thumbnail: string;
}

export default function SuccessScreen({ challengeId, thumbnail }: SuccessScreenProps) {
	const router = useRouter();
	const [copied, setCopied] = useState(false);

	const handleCopyLink = () => {
		const url = `${window.location.origin}/play/${challengeId}`;
		navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handlePlay = () => {
		router.push(`/play/${challengeId}`);
	};

	const handleViewChallenges = () => {
		router.push("/challenges");
	};

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-md animate-fade-in rounded-lg bg-chalkboard-bg p-8">
				{/* Title */}
				<h2 className="chalk-text mb-6 text-center text-3xl font-bold text-chalk-yellow">
					챌린지 완성!
				</h2>

				{/* Thumbnail */}
				<div className="relative mb-6 aspect-video overflow-hidden rounded-md border-4 border-chalk-white">
					<Image src={thumbnail} alt="챌린지 썸네일" fill className="object-cover" sizes="400px" />
				</div>

				{/* Actions */}
				<div className="space-y-3">
					<ChalkButton
						variant="yellow"
						onClick={handleCopyLink}
						className="flex w-full items-center justify-center gap-2"
					>
						<Copy size={20} />
						{copied ? "복사 완료!" : "링크 복사"}
					</ChalkButton>

					<ChalkButton
						variant="blue"
						onClick={handlePlay}
						className="flex w-full items-center justify-center gap-2"
					>
						<Play size={20} />
						바로 플레이
					</ChalkButton>

					<ChalkButton
						variant="white"
						onClick={handleViewChallenges}
						className="flex w-full items-center justify-center gap-2"
					>
						챌린지 둘러보기
					</ChalkButton>
				</div>
			</div>
		</div>
	);
}
