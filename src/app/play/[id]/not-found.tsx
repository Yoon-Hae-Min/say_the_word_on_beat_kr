import Link from "next/link";
import { WoodFrame } from "@/shared/ui";

export default function NotFound() {
	return (
		<WoodFrame>
			<div className="min-h-screen flex items-center justify-center bg-chalkboard-bg">
				<div className="text-center">
					<p className="text-chalk-white chalk-text text-2xl mb-4">
						챌린지를 찾을 수 없습니다
					</p>
					<Link
						href="/"
						className="text-chalk-yellow hover:text-chalk-yellow/80 underline chalk-text text-lg"
					>
						홈으로 돌아가기
					</Link>
				</div>
			</div>
		</WoodFrame>
	);
}
