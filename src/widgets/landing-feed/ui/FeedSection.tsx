"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPopularChallenges } from "@/entities/challenge";
import { ChalkCard } from "@/shared/ui";

interface PopularChallenge {
	id: string;
	title: string;
	viewCount: number;
	thumbnail: string;
	createdAt: string;
}

export default function FeedSection() {
	const router = useRouter();
	const [challenges, setChallenges] = useState<PopularChallenge[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadChallenges = async () => {
			try {
				const data = await getPopularChallenges(9);
				setChallenges(data);
			} catch (error) {
				console.error("Failed to load popular challenges:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadChallenges();
	}, []);

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
						<p className="chalk-text text-chalk-white text-xl animate-pulse">
							로딩 중...
						</p>
					</div>
				)}

				{/* Empty state */}
				{!isLoading && challenges.length === 0 && (
					<div className="text-center py-12">
						<p className="chalk-text text-chalk-white text-xl">
							아직 공개된 챌린지가 없습니다.
						</p>
						<p className="text-chalk-white/60 mt-2">
							첫 번째 챌린지를 만들어보세요!
						</p>
					</div>
				)}

				{/* Challenge grid */}
				{!isLoading && challenges.length > 0 && (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{challenges.map((challenge, index) => (
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
						))}
					</div>
				)}
			</div>
		</section>
	);
}
