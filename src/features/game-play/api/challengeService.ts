import type { DatabaseChallenge } from "@/entities/challenge";
import {
	getChallengeById as getChallengeFromDB,
	incrementViewCount as incrementViewCountInDB,
} from "@/entities/challenge";
import { markChallengeAsViewed } from "@/shared/lib/user/viewTracking";

/**
 * Fetch a challenge by ID from the database
 * Returns database row with imagePath as public URLs
 */
export async function getChallengeById(
	id: string
): Promise<DatabaseChallenge | null> {
	return getChallengeFromDB(id);
}

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
