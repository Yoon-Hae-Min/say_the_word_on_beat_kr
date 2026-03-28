import { cache } from "react";
import type { ClientSafeChallenge } from "@/entities/challenge";
import {
	getChallengeById as getChallengeFromDB,
	incrementViewCount as incrementViewCountInDB,
} from "@/entities/challenge";
import { markChallengeAsViewed } from "@/shared/lib/user/viewTracking";

/**
 * Fetch a challenge by ID from the database (memoized per render cycle).
 * React cache() deduplicates calls within the same server render,
 * so generateMetadata + PlayLayout share a single DB query.
 */
export const getChallengeById = cache(
	async (id: string, userId?: string): Promise<ClientSafeChallenge | null> => {
		return getChallengeFromDB(id, userId);
	}
);

/**
 * Increment the view count for a challenge
 * Only increments if the user hasn't viewed this challenge before (checked via localStorage)
 * @param id - Challenge UUID
 */
export async function incrementViewCount(id: string): Promise<void> {
	try {
		// Check if this is a new view (using localStorage)
		const isNewView = markChallengeAsViewed(id);

		// Only increment in database if this is a new view
		if (isNewView) {
			await incrementViewCountInDB(id);
		}
	} catch (error) {
		console.error("Error incrementing view count:", error);
		// Don't throw - view count increment shouldn't block gameplay
	}
}
