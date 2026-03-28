"use client";

import { UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyPageButton() {
	const router = useRouter();

	return (
		<div className="sticky top-0 z-40 flex justify-end px-4 pt-4 md:px-8 md:pt-6">
			<button
				type="button"
				onClick={() => router.push("/my")}
				className="flex h-10 items-center gap-2 rounded-lg border-2 border-chalk-white/40 bg-chalkboard-bg/90 px-3 backdrop-blur-sm transition-all hover:border-chalk-yellow hover:bg-chalkboard-bg hover:scale-105 md:h-11 md:px-4"
				aria-label="내 챌린지"
			>
				<UserCircle className="h-5 w-5 text-chalk-white" />
				<span className="chalk-text text-sm text-chalk-white">내 챌린지</span>
			</button>
		</div>
	);
}
