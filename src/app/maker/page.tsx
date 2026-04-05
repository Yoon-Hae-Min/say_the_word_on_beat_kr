import { Suspense } from "react";
import { WoodFrame } from "@/shared/ui";
import MakerClient from "./MakerClient";

export const revalidate = 600;

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
			<MakerClient />
		</Suspense>
	);
}
