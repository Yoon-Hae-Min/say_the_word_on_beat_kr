import type { DatabaseChallenge } from "@/entities/challenge";
import {
	getChallengeById as getChallengeFromDB,
	incrementViewCount as incrementViewCountInDB,
} from "@/entities/challenge";

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
