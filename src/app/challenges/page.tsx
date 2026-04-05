import { Suspense } from "react";
import { LoadingState } from "@/shared/ui";
import ChallengesContent from "./ChallengesClient";

export const revalidate = 300;

export default function ChallengesPage() {
	return (
		<Suspense fallback={<LoadingState />}>
			<ChallengesContent />
		</Suspense>
	);
}
