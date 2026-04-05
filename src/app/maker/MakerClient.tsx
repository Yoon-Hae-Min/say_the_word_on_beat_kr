"use client";

import { useSearchParams } from "next/navigation";
import { ChallengeCreation } from "@/features/challenge-creation";
import { WoodFrame } from "@/shared/ui";

export default function MakerClient() {
	const searchParams = useSearchParams();
	const visibility = searchParams.get("visibility") || "public";

	return (
		<WoodFrame>
			<ChallengeCreation isPublic={visibility === "public"} />
		</WoodFrame>
	);
}
