import { supabase } from "@/shared/api/supabase/client";
import type { GameConfigStruct } from "../model/types";

/**
 * Create a challenge in the database
 */
export async function createChallenge(input: {
	title: string;
	isPublic: boolean;
	thumbnailUrl?: string;
	gameConfig: GameConfigStruct[];
}): Promise<{ id: string }> {
	const { data, error } = await supabase
		.from("challenges")
		.insert({
			title: input.title,
			is_public: input.isPublic,
			thumbnail_url: input.thumbnailUrl || null,
			game_config: input.gameConfig,
		})
		.select("id")
		.single();

	if (error) {
		throw new Error(`Failed to create challenge: ${error.message}`);
	}

	if (!data) {
		throw new Error("Failed to create challenge: no data returned");
	}

	return { id: data.id };
}

/**
 * Get challenge by ID
 */
export async function getChallengeById(id: string): Promise<{
	id: string;
	title: string;
	isPublic: boolean;
	viewCount: number;
	thumbnailUrl: string | null;
	gameConfig: GameConfigStruct[];
	createdAt: string;
} | null> {
	const { data, error } = await supabase
		.from("challenges")
		.select("id, title, is_public, view_count, thumbnail_url, game_config, created_at")
		.eq("id", id)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			// Not found
			return null;
		}
		throw new Error(`Failed to fetch challenge: ${error.message}`);
	}

	if (!data) {
		return null;
	}

	return {
		id: data.id,
		title: data.title,
		isPublic: data.is_public,
		viewCount: data.view_count,
		thumbnailUrl: data.thumbnail_url,
		gameConfig: (data.game_config as GameConfigStruct[]) || [],
		createdAt: data.created_at,
	};
}

/**
 * Increment view count using Supabase Database Function
 */
export async function incrementViewCount(id: string): Promise<void> {
	const { error } = await supabase.rpc("increment_view_count", {
		row_id: id,
	});

	if (error) {
		console.error("Failed to increment view count:", error);
	}
}

/**
 * Get popular public challenges ordered by view count
 */
export async function getPopularChallenges(limit: number = 9): Promise<
	Array<{
		id: string;
		title: string;
		viewCount: number;
		thumbnail: string;
		createdAt: string;
	}>
> {
	const { data, error } = await supabase
		.from("challenges")
		.select("id, title, view_count, thumbnail_url, game_config, created_at")
		.eq("is_public", true)
		.order("view_count", { ascending: false })
		.limit(limit);

	if (error) {
		console.error("Failed to fetch popular challenges:", error);
		return [];
	}

	if (!data || data.length === 0) {
		return [];
	}

	return data.map((challenge) => {
		// Use thumbnail_url if available, otherwise extract from first slot
		let thumbnailUrl = challenge.thumbnail_url;

		if (!thumbnailUrl) {
			const gameConfig = challenge.game_config as GameConfigStruct[] | null;
			const firstImagePath = gameConfig?.[0]?.slots?.[0]?.imagePath;

			if (firstImagePath) {
				const { data: publicData } = supabase.storage
					.from("challenge-images")
					.getPublicUrl(firstImagePath);
				thumbnailUrl = publicData.publicUrl;
			}
		}

		return {
			id: challenge.id,
			title: challenge.title,
			viewCount: challenge.view_count,
			thumbnail: thumbnailUrl || "/placeholder.svg",
			createdAt: challenge.created_at,
		};
	});
}
