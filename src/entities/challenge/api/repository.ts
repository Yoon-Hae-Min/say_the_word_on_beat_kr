import { supabase } from "@/shared/api/supabase/client";
import type { ClientSafeChallenge, GameConfigStruct } from "../model/types";

/**
 * Helper function to convert storage image paths to public URLs
 * Handles both thumbnail_url and fallback to first slot image
 */
export function convertImagePathToUrl(
	challenge: Pick<ClientSafeChallenge, "thumbnail_url" | "game_config">
): string {
	// Get image path from thumbnail_url or first slot
	let imagePath = challenge.thumbnail_url;

	if (!imagePath) {
		// Fallback to first slot of first round
		const gameConfig = challenge.game_config;
		imagePath = gameConfig?.[0]?.slots?.[0]?.imagePath ?? null;
	}

	// Convert image path to full public URL using R2
	if (imagePath) {
		const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
		if (!r2PublicUrl) {
			console.error("NEXT_PUBLIC_R2_PUBLIC_URL is not defined");
			return "/placeholder.svg";
		}
		return `${r2PublicUrl}/${imagePath}`;
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
 * Get challenge by ID using Supabase RPC function
 * Returns database row with imagePath converted to public URLs
 * Uses RPC to calculate isMine without exposing creator_id to client
 * @param id - Challenge ID
 * @param userId - Optional user ID to check ownership (sets isMine field)
 */
export async function getChallengeById(
	id: string,
	userId?: string
): Promise<ClientSafeChallenge | null> {
	try {
		// Use RPC function to get challenge with ownership check
		// This prevents creator_id from being exposed to the client
		const { data, error } = await supabase
			.rpc("get_challenge_with_ownership", {
				challenge_id: id,
				user_id: userId,
			})
			.single();

		if (error) {
			console.error("Error fetching challenge:", error);
			return null;
		}

		if (!data) {
			return null;
		}

		// Convert image paths to public URLs in game_config slots using R2
		// Type cast game_config as it comes from JSONB in the database
		const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
		const gameConfig = data.game_config as unknown as GameConfigStruct[] | null;
		const transformedGameConfig = gameConfig?.map((round) => ({
			...round,
			slots:
				round.slots?.map((slot) => {
					if (slot.imagePath && r2PublicUrl) {
						return {
							...slot,
							imagePath: `${r2PublicUrl}/${slot.imagePath}`,
						};
					}
					return slot;
				}) ?? null,
		}));

		return {
			id: data.id,
			title: data.title,
			is_public: data.is_public,
			show_names: data.show_names,
			thumbnail_url: data.thumbnail_url,
			view_count: data.view_count,
			created_at: data.created_at,
			difficulty_easy: data.difficulty_easy,
			difficulty_hard: data.difficulty_hard,
			difficulty_normal: data.difficulty_normal,
			game_config: transformedGameConfig || [],
			isMine: data.is_mine, // Map is_mine from DB to isMine for client
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
		isPublic: boolean;
		createdAt: string;
		difficultyEasy: number;
		difficultyNormal: number;
		difficultyHard: number;
	}>
> {
	try {
		const { data, error } = await supabase
			.from("challenges")
			.select(
				"id, title, is_public, show_names, thumbnail_url, game_config, view_count, created_at, difficulty_easy, difficulty_hard, difficulty_normal"
			)
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
				isPublic: node.is_public,
				createdAt: node.created_at,
				difficultyEasy: node.difficulty_easy ?? 0,
				difficultyNormal: node.difficulty_normal ?? 0,
				difficultyHard: node.difficulty_hard ?? 0,
			};
		});

		return challenges;
	} catch (error) {
		console.error("Failed to fetch popular challenges:", error);
		return [];
	}
}

/**
 * Get total count of public challenges
 */
export async function getPublicChallengesCount(): Promise<number> {
	try {
		const { count, error } = await supabase
			.from("challenges")
			.select("*", { count: "exact", head: true })
			.eq("is_public", true);

		if (error) {
			console.error("Failed to fetch challenges count:", error);
			return 0;
		}

		return count || 0;
	} catch (error) {
		console.error("Failed to fetch challenges count:", error);
		return 0;
	}
}

/**
 * Get all public challenges ordered by creation date using REST API
 */
export async function getAllChallenges(
	limit: number = 50,
	offset: number = 0,
	sortBy: import("../model/types").ChallengeSortBy = "latest"
): Promise<
	Array<{
		id: string;
		title: string;
		viewCount: number;
		thumbnail: string;
		showNames: boolean;
		isPublic: boolean;
		createdAt: string;
		difficultyEasy: number;
		difficultyNormal: number;
		difficultyHard: number;
	}>
> {
	try {
		// Use RPC function for recommended sort
		if (sortBy === "recommended") {
			const { data, error } = await supabase.rpc("get_recommended_challenges", {
				limit_count: limit,
				offset_count: offset,
			});

			if (error) {
				console.error("Failed to fetch recommended challenges:", error);
				return [];
			}

			const challenges = (data || []).map((node) => {
				const thumbnailUrl = convertImagePathToUrl(node);

				return {
					id: node.id,
					title: node.title,
					viewCount: Number(node.view_count), // Convert BIGINT to number
					thumbnail: thumbnailUrl,
					showNames: node.show_names,
					isPublic: node.is_public,
					createdAt: node.created_at,
					difficultyEasy: node.difficulty_easy ?? 0,
					difficultyNormal: node.difficulty_normal ?? 0,
					difficultyHard: node.difficulty_hard ?? 0,
				};
			});

			return challenges;
		}

		// Determine sort configuration based on sortBy parameter
		const orderColumn = sortBy === "views" ? "view_count" : "created_at";

		const { data, error } = await supabase
			.from("challenges")
			.select(
				"id, title, is_public, show_names, thumbnail_url, game_config, view_count, created_at, difficulty_easy, difficulty_hard, difficulty_normal"
			)
			.eq("is_public", true)
			.order(orderColumn, { ascending: false })
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
				isPublic: node.is_public,
				createdAt: node.created_at,
				difficultyEasy: node.difficulty_easy ?? 0,
				difficultyNormal: node.difficulty_normal ?? 0,
				difficultyHard: node.difficulty_hard ?? 0,
			};
		});

		return challenges;
	} catch (error) {
		console.error("Failed to fetch all challenges:", error);
		return [];
	}
}

/**
 * Get challenges created by specific user (filtered by creator_id)
 * Includes both public and private challenges
 */
export async function getMyChallenges(
	userId: string,
	limit: number = 50,
	offset: number = 0,
	sortBy: import("../model/types").ChallengeSortBy = "latest"
): Promise<
	Array<{
		id: string;
		title: string;
		viewCount: number;
		thumbnail: string;
		showNames: boolean;
		isPublic: boolean;
		createdAt: string;
		difficultyEasy: number;
		difficultyNormal: number;
		difficultyHard: number;
	}>
> {
	try {
		// Determine sort configuration based on sortBy parameter
		const orderColumn = sortBy === "views" ? "view_count" : "created_at";

		const { data, error } = await supabase
			.from("challenges")
			.select(
				"id, title, is_public, show_names, thumbnail_url, game_config, view_count, created_at, difficulty_easy, difficulty_hard, difficulty_normal"
			)
			.eq("creator_id", userId)
			.order(orderColumn, { ascending: false })
			.range(offset, offset + limit - 1);

		if (error) {
			console.error("Failed to fetch my challenges:", error);
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
				isPublic: node.is_public,
				createdAt: node.created_at,
				difficultyEasy: node.difficulty_easy ?? 0,
				difficultyNormal: node.difficulty_normal ?? 0,
				difficultyHard: node.difficulty_hard ?? 0,
			};
		});

		return challenges;
	} catch (error) {
		console.error("Failed to fetch my challenges:", error);
		return [];
	}
}

/**
 * Get total count of user's challenges (both public and private)
 */
export async function getMyChallengesCount(userId: string): Promise<number> {
	try {
		const { count, error } = await supabase
			.from("challenges")
			.select("*", { count: "exact", head: true })
			.eq("creator_id", userId);

		if (error) {
			console.error("Failed to fetch my challenges count:", error);
			return 0;
		}

		return count || 0;
	} catch (error) {
		console.error("Failed to fetch my challenges count:", error);
		return 0;
	}
}

/**
 * @deprecated Use getMyChallengesCount instead
 * Get total count of user's public challenges
 */
export async function getMyPublicChallengesCount(userId: string): Promise<number> {
	return getMyChallengesCount(userId);
}

/**
 * Toggle challenge public/private status
 * @param challengeId - Challenge ID
 * @param userId - User ID for verification
 * @param isPublic - New public status
 */
export async function updateChallengePublicStatus(
	challengeId: string,
	userId: string,
	isPublic: boolean
): Promise<void> {
	const response = await fetch(`/api/admin/challenges/${challengeId}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId,
			isPublic,
		}),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Failed to update challenge public status");
	}
}
