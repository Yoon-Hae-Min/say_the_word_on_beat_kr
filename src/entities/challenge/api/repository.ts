import { supabase } from "@/shared/api/supabase/client";

/**
 * Create a challenge in the database
 */
export async function createChallenge(input: {
	title: string;
	isPublic: boolean;
	gameConfig: Record<string, unknown>;
}): Promise<{ id: string }> {
	const { data, error } = await supabase
		.from("challenges")
		.insert({
			title: input.title,
			is_public: input.isPublic,
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
	gameConfig: Record<string, unknown>;
	createdAt: string;
} | null> {
	const { data, error } = await supabase
		.from("challenges")
		.select("id, title, is_public, view_count, game_config, created_at")
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
		gameConfig: data.game_config as Record<string, unknown>,
		createdAt: data.created_at,
	};
}

/**
 * Increment view count
 */
export async function incrementViewCount(id: string): Promise<void> {
	// First, get current view count
	const { data: currentData } = await supabase
		.from("challenges")
		.select("view_count")
		.eq("id", id)
		.single();

	if (currentData) {
		// Then increment it
		const { error } = await supabase
			.from("challenges")
			.update({ view_count: currentData.view_count + 1 })
			.eq("id", id);

		if (error) {
			console.error("Failed to increment view count:", error);
		}
	}
}
