import type { ChallengeData, Round } from "@/entities/challenge";
import type { Resource } from "@/entities/resource";
import {
	getChallengeById as getChallengeFromDB,
	incrementViewCount as incrementViewCountInDB,
} from "@/entities/challenge";
import { supabase } from "@/shared/api/supabase/client";

/**
 * Fetch a challenge by ID from the database
 * @param id - Challenge UUID
 * @returns Challenge data formatted for the game
 */
export async function getChallengeById(
	id: string
): Promise<ChallengeData | null> {
	try {
		const dbChallenge = await getChallengeFromDB(id);

		if (!dbChallenge) {
			return null;
		}

		// Convert database format to ChallengeData format
		const gameConfig = dbChallenge.gameConfig;

		// Extract unique resources from all rounds
		const resourceMap = new Map<string, Resource>();

		gameConfig.forEach((round) => {
			if (!round.slots) return;

			round.slots.forEach((slot) => {
				if (slot.imagePath && !resourceMap.has(slot.imagePath)) {
					// Get public URL for the image
					const { data } = supabase.storage
						.from("challenge-images")
						.getPublicUrl(slot.imagePath);

					resourceMap.set(slot.imagePath, {
						id: slot.imagePath, // Use path as ID
						name: slot.displayText || "",
						imageUrl: data.publicUrl,
					});
				}
			});
		});

		const resources = Array.from(resourceMap.values());

		// Build rounds with resource references
		const rounds: Round[] = gameConfig.map((round) => ({
			id: round.roundIndex ?? 0,
			slots: (round.slots || []).map((slot) => ({
				resourceId: slot.imagePath, // Reference by path (can be null)
			})),
		}));

		const challengeData: ChallengeData = {
			title: dbChallenge.title,
			rounds,
			resources,
			isPublic: dbChallenge.isPublic,
			songUrl: undefined, // songUrl is not stored in database
		};

		return challengeData;
	} catch (error) {
		console.error("Error fetching challenge:", error);
		throw new Error(
			`Failed to fetch challenge: ${error instanceof Error ? error.message : "Unknown error"}`
		);
	}
}

/**
 * Increment the view count for a challenge
 * @param id - Challenge UUID
 */
export async function incrementViewCount(id: string): Promise<void> {
	try {
		await incrementViewCountInDB(id);
	} catch (error) {
		console.error("Error incrementing view count:", error);
		// Don't throw - view count increment shouldn't block gameplay
	}
}
