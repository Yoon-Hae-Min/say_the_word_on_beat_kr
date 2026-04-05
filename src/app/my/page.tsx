import { Suspense } from "react";
import { LoadingState } from "@/shared/ui";
import MyClient from "./MyClient";

export const revalidate = 600;

export default function MyPage() {
	return (
		<Suspense fallback={<LoadingState />}>
			<MyClient />
		</Suspense>
	);
}
