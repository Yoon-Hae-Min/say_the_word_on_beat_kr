"use client";

import ChalkCard from "@/components/ui/ChalkCard";
import { mockChallenges } from "@/data/mockChallenges";

export default function FeedSection() {
	// Filter and sort challenges
	const publicChallenges = mockChallenges
		.filter((challenge) => challenge.isPublic)
		.sort((a, b) => b.viewCount - a.viewCount);

	return (
		<section className="px-4 py-16">
			<div className="mx-auto max-w-6xl">
				{/* Section title */}
				<h2 className="chalk-text mb-8 text-center text-4xl font-bold text-chalk-white md:text-5xl">
					인기 챌린지
				</h2>

				{/* Challenge grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{publicChallenges.map((challenge, index) => (
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
									// Navigate to play page when implemented
									console.log(`Play challenge: ${challenge.id}`);
								}}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
