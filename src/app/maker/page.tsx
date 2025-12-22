"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ChallengeCreation } from "@/features/challenge-creation";
import { WoodFrame } from "@/shared/ui";

function MakerContent() {
	const searchParams = useSearchParams();
	const visibility = searchParams.get("visibility") || "public";

	return (
		<WoodFrame>
			<ChallengeCreation isPublic={visibility === "public"} />
		</WoodFrame>
	);
}

export default function MakerPage() {
	return (
		<Suspense
			fallback={
				<WoodFrame>
					<div className="min-h-screen bg-chalkboard-bg flex items-center justify-center">
						<p className="chalk-text text-chalk-white text-2xl">로딩 중...</p>
					</div>
				</WoodFrame>
			}
		>
			<MakerContent />
		</Suspense>
	);
}
