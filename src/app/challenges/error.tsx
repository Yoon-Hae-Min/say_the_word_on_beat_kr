"use client";

import Link from "next/link";

export default function ChallengesError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-chalkboard-bg p-4">
			<div className="text-center">
				<h1 className="chalk-text text-3xl text-chalk-yellow">챌린지 목록 로딩 실패</h1>
				<p className="mt-4 text-chalk-white/80">
					{error.message || "챌린지 목록을 불러오는 중 문제가 발생했습니다"}
				</p>
				<div className="mt-6 flex flex-col items-center gap-3">
					<button
						type="button"
						onClick={reset}
						className="rounded-lg border-2 border-chalk-white px-6 py-3 chalk-text text-chalk-white transition-all hover:bg-chalk-white/10"
					>
						다시 시도
					</button>
					<Link
						href="/"
						className="text-chalk-yellow underline transition-colors hover:text-chalk-yellow/80"
					>
						홈으로 돌아가기
					</Link>
				</div>
			</div>
		</div>
	);
}
