import type { MetadataRoute } from "next";
import { getAllChallenges, getPublicChallengesCount } from "@/entities/challenge/api/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://say-the-word-on-beat.vercel.app";

	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/challenges`,
			lastModified: new Date(),
			changeFrequency: "hourly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},
	];

	try {
		// Dynamic challenge pages
		const totalCount = await getPublicChallengesCount();
		const challenges = await getAllChallenges(totalCount, 0, "latest");

		const challengePages: MetadataRoute.Sitemap = challenges.map((challenge) => ({
			url: `${baseUrl}/play/${challenge.id}`,
			lastModified: new Date(challenge.createdAt),
			changeFrequency: "weekly",
			priority: 0.7,
		}));

		return [...staticPages, ...challengePages];
	} catch (error) {
		console.error("Error generating sitemap:", error);
		// Return static pages only if dynamic fetch fails
		return staticPages;
	}
}
