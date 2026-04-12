import type { MetadataRoute } from "next";
import { getAllChallenges, getPublicChallengesCount } from "@/entities/challenge";

// 1시간마다 재생성 — Googlebot 요청 시 캐시된 버전을 즉시 반환
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://word-on-beat.store";

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
			url: `${baseUrl}/guide`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/faq`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
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
