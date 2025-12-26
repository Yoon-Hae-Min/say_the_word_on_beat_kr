import { supabase } from "@/shared/api/supabase/client";
import type {
	GameConfigStruct,
	ChallengeInsert,
	DatabaseChallenge,
} from "../model/types";

/**
 * Helper function to convert storage image paths to public URLs
 * Handles both thumbnail_url and fallback to first slot image
 */
function convertImagePathToUrl(challenge: DatabaseChallenge): string {
	// Get image path from thumbnail_url or first slot
	let imagePath = challenge.thumbnail_url;

	if (!imagePath) {
		// Fallback to first slot of first round
		const gameConfig = challenge.game_config;
		imagePath = gameConfig?.[0]?.slots?.[0]?.imagePath ?? null;
	}

	// Convert image path to full public URL
	if (imagePath) {
		const { data: publicData } = supabase.storage
			.from("challenge-images")
			.getPublicUrl(imagePath);
		return publicData.publicUrl;
	}

	return "/placeholder.svg";
}

/**
 * Create a challenge in the database using REST API
 */
export async function createChallenge(input: {
	title: string;
	isPublic: boolean;
	showNames: boolean;
	thumbnailUrl?: string;
	gameConfig: GameConfigStruct[];
	creatorId?: string;
}): Promise<{ id: string }> {
	const { data, error } = await supabase
		.from("challenges")
		.insert({
			title: input.title,
			is_public: input.isPublic,
			show_names: input.showNames,
			thumbnail_url: input.thumbnailUrl || null,
			game_config: input.gameConfig,
			creator_id: input.creatorId || null,
		})
		.select("id")
		.single();

	if (error) {
		throw new Error(`Failed to create challenge: ${error.message}`);
	}

	if (!data?.id) {
		throw new Error("Failed to create challenge: no ID returned");
	}

	return { id: data.id };
}

/**
 * Get challenge by ID using REST API
 * Returns database row with imagePath converted to public URLs
 */
export async function getChallengeById(
	id: string
): Promise<DatabaseChallenge | null> {
	try {
		const { data, error } = await supabase
			.from("challenges")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			console.error("Error fetching challenge:", error);
			return null;
		}

		if (!data) {
			return null;
		}

		// Convert image paths to public URLs in game_config slots
		const transformedGameConfig = data.game_config?.map((round) => ({
			...round,
			slots: round.slots?.map((slot) => {
				if (slot.imagePath) {
					const { data: publicData } = supabase.storage
						.from("challenge-images")
						.getPublicUrl(slot.imagePath);
					return {
						...slot,
						imagePath: publicData.publicUrl,
					};
				}
				return slot;
			}) ?? null,
		}));

		return {
			...data,
			game_config: transformedGameConfig ?? null,
		};
	} catch (error) {
		console.error("Error fetching challenge:", error);
		return null;
	}
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
 * Get popular public challenges ordered by view count using REST API
 */
export async function getPopularChallenges(limit: number = 9): Promise<
	Array<{
		id: string;
		title: string;
		viewCount: number;
		thumbnail: string;
		showNames: boolean;
		createdAt: string;
	}>
> {
	try {
		const { data, error } = await supabase
			.from("challenges")
			.select("*")
			.eq("is_public", true)
			.order("view_count", { ascending: false })
			.limit(limit);

		if (error) {
			console.error("Failed to fetch popular challenges:", error);
			return [];
		}

		const challenges = (data || []).map((node) => {
			const thumbnailUrl = convertImagePathToUrl(node);

			return {
				id: node.id,
				title: node.title,
				viewCount: node.view_count,
				thumbnail: thumbnailUrl,
				showNames: node.show_names,
				createdAt: node.created_at,
			};
		});

		return challenges;
	} catch (error) {
		console.error("Failed to fetch popular challenges:", error);
		return [];
	}
}

/**
 * Get all public challenges ordered by creation date using REST API
 */
export async function getAllChallenges(
	limit: number = 50,
	offset: number = 0
): Promise<
	Array<{
		id: string;
		title: string;
		viewCount: number;
		thumbnail: string;
		showNames: boolean;
		createdAt: string;
	}>
> {
	try {
		const { data, error } = await supabase
			.from("challenges")
			.select("*")
			.eq("is_public", true)
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (error) {
			console.error("Failed to fetch all challenges:", error);
			return [];
		}

		const challenges = (data || []).map((node) => {
			const thumbnailUrl = convertImagePathToUrl(node);

			return {
				id: node.id,
				title: node.title,
				viewCount: node.view_count,
				thumbnail: thumbnailUrl,
				showNames: node.show_names,
				createdAt: node.created_at,
			};
		});

		return challenges;
	} catch (error) {
		console.error("Failed to fetch all challenges:", error);
		return [];
	}
}
