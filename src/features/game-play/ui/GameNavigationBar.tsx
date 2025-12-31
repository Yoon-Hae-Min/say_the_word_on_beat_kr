"use client";

import { Home, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ClientSafeChallenge } from "@/entities/challenge";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface GameNavigationBarProps {
	challengeData: ClientSafeChallenge;
}

export default function GameNavigationBar({ challengeData }: GameNavigationBarProps) {
	const router = useRouter();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
