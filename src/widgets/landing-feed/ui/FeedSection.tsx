"use client";

import { useRouter } from "next/navigation";
import { usePopularChallenges } from "@/entities/challenge/api/queries";
import { ChalkCard } from "@/shared/ui";

export default function FeedSection() {
	const router = useRouter();
	const { data: challenges = [], isLoading } = usePopularChallenges(9);

	return (
		<section className="px-4 py-16">
			<div className="mx-auto max-w-6xl">
				{/* Section title */}
				<h2 className="chalk-text mb-8 text-center text-4xl font-bold text-chalk-white md:text-5xl">
					인기 챌린지
				</h2>

				{/* Loading state */}
				{isLoading && (
					<div className="text-center py-12">
						<p className="chalk-text text-chalk-white text-xl animate-pulse">로딩 중...</p>
					</div>
				)}

				{/* Empty state */}
				{!isLoading && challenges.length === 0 && (
					<div className="text-center py-12">
						<p className="chalk-text text-chalk-white text-xl">아직 공개된 챌린지가 없습니다.</p>
						<p className="text-chalk-white/60 mt-2">첫 번째 챌린지를 만들어보세요!</p>
					</div>
				)}

				{/* Challenge grid */}
				{!isLoading && challenges.length > 0 && (
					<>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{challenges.map((challenge, index) => {
								return (
									<div
										key={challenge.id}
										className="animate-fade-in"
										style={{
											animationDelay: `${index * 100}ms`,
											animationFillMode: "backwards",
										}}
									>
										<ChalkCard
											title={challenge.title}
											thumbnail={challenge.thumbnail}
											viewCount={challenge.viewCount}
											onClick={() => {
												router.push(`/play/${challenge.id}`);
											}}
										/>
									</div>
								);
							})}
						</div>

						{/* View all button */}
						<div className="mt-12 text-center">
							<button
								onClick={() => router.push("/challenges")}
								className="chalk-text inline-block rounded-lg border-2 border-chalk-yellow bg-chalkboard-bg/60 px-8 py-4 text-xl font-bold text-chalk-yellow hover:bg-chalk-yellow hover:text-chalkboard-bg transition-all md:text-2xl"
							>
								모든 챌린지 보기 →
							</button>
						</div>
					</>
				)}
			</div>
		</section>
	);
}
