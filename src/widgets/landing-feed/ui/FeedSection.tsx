"use client";

import { useRouter } from "next/navigation";
import { usePopularChallenges } from "@/entities/challenge";
import { sendGAEvent } from "@/shared/lib/analytics/gtag";
import { ChalkButton, ChalkCard } from "@/shared/ui";

export default function FeedSection() {
	const router = useRouter();
	const { data: challenges = [], isLoading } = usePopularChallenges(6);

	return (
		<section className="px-4 py-16">
			<div className="mx-auto max-w-6xl">
				{/* Section title */}
				<h2 className="chalk-text mb-2 text-center text-4xl font-bold text-chalk-white md:text-5xl">
					인기 챌린지
				</h2>
				<p className="chalk-text mb-8 text-center text-lg text-chalk-white/70">
					지금 가장 많이 플레이되는 챌린지
				</p>

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
											isPublic={challenge.isPublic}
											difficultyStats={{
												easy: challenge.difficultyEasy,
												normal: challenge.difficultyNormal,
												hard: challenge.difficultyHard,
											}}
											onClick={() => {
												sendGAEvent({
													action: "challenge_card_click",
													category: "landing_feed",
													label: challenge.title,
												});
												router.push(`/play/${challenge.id}`);
											}}
										/>
									</div>
								);
							})}
						</div>

						{/* View all button */}
						<div className="mt-12 text-center">
							<ChalkButton
								variant="white-outline"
								className="px-8 py-4 text-xl md:text-2xl"
								onClick={() => {
									sendGAEvent({
										action: "view_all_click",
										category: "landing_feed",
									});
									router.push("/challenges");
								}}
							>
								모든 챌린지 보기 →
							</ChalkButton>
						</div>
					</>
				)}
			</div>
		</section>
	);
}
