/**
 * ChallengeGrid Component
 *
 * Grid layout for displaying challenges with stagger animations.
 * Extracted from ChallengesPage to follow Single Responsibility Principle.
 */

"use client";

import { useRouter } from "next/navigation";
import { ChalkCard } from "@/shared/ui";

interface Challenge {
	id: string;
	title: string;
	viewCount: number;
	thumbnail: string;
	isPublic: boolean;
	createdAt: string;
	difficultyEasy: number;
	difficultyNormal: number;
	difficultyHard: number;
}

interface ChallengeGridProps {
	/**
	 * Array of challenges to display
	 */
	challenges: Challenge[];

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Grid of challenge cards with stagger animations
 *
 * @example
 * ```tsx
 * <ChallengeGrid challenges={challenges} />
 * ```
 */
export default function ChallengeGrid({ challenges, className = "" }: ChallengeGridProps) {
	const router = useRouter();

	return (
		<div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
			{challenges.map((challenge, index) => (
				<div
					key={challenge.id}
					className="animate-fade-in"
					style={{
						animationDelay: `${index * 50}ms`,
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
							router.push(`/play/${challenge.id}`);
						}}
					/>
				</div>
			))}
		</div>
	);
}
