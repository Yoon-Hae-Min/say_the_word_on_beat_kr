"use client";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-chalkboard-bg p-4">
			<div className="text-center">
				<h1 className="chalk-text text-4xl text-chalk-yellow">오류 발생</h1>
				<p className="mt-4 text-chalk-white">{error.message || "알 수 없는 오류가 발생했습니다"}</p>
				<button
					type="button"
					onClick={reset}
					className="mt-6 rounded-lg border-2 border-chalk-white px-6 py-3 chalk-text text-chalk-white transition-all hover:bg-chalk-white/10"
				>
					다시 시도
				</button>
			</div>
		</div>
	);
}
