/**
 * Local storage based view tracking
 * Tracks which challenges the user has viewed to prevent duplicate view counts
 */

const VIEWED_CHALLENGES_KEY = "viewed_challenges";

interface ViewRecord {
	challengeId: string;
	viewedAt: number; // timestamp
}

/**
 * Get all viewed challenges from local storage
 */
function getViewedChallenges(): ViewRecord[] {
	if (typeof window === "undefined") return [];

	try {
		const stored = localStorage.getItem(VIEWED_CHALLENGES_KEY);
		if (!stored) return [];
		return JSON.parse(stored) as ViewRecord[];
	} catch (error) {
		console.error("Error reading viewed challenges:", error);
		return [];
	}
}

/**
 * Save viewed challenges to local storage
 */
function saveViewedChallenges(records: ViewRecord[]): void {
	if (typeof window === "undefined") return;

	try {
		localStorage.setItem(VIEWED_CHALLENGES_KEY, JSON.stringify(records));
	} catch (error) {
		console.error("Error saving viewed challenges:", error);
	}
}

/**
 * Check if a challenge has been viewed before
 * @param challengeId - The challenge UUID
 * @returns true if already viewed, false if new view
 */
export function hasViewedChallenge(challengeId: string): boolean {
	const viewed = getViewedChallenges();
	return viewed.some((record) => record.challengeId === challengeId);
}

/**
 * Mark a challenge as viewed
 * @param challengeId - The challenge UUID
 * @returns true if this is a new view, false if already viewed
 */
export function markChallengeAsViewed(challengeId: string): boolean {
	// Check if already viewed
	if (hasViewedChallenge(challengeId)) {
		return false; // Already viewed
	}

	// Add new view record
	const viewed = getViewedChallenges();
	viewed.push({
		challengeId,
		viewedAt: Date.now(),
	});

	saveViewedChallenges(viewed);
	return true; // New view
}

/**
 * Clear all view history (for testing/debugging)
 */
export function clearViewHistory(): void {
	if (typeof window === "undefined") return;

	try {
		localStorage.removeItem(VIEWED_CHALLENGES_KEY);
	} catch (error) {
		console.error("Error clearing view history:", error);
	}
}

/**
 * Get total number of challenges viewed
 */
export function getViewedChallengesCount(): number {
	return getViewedChallenges().length;
}
