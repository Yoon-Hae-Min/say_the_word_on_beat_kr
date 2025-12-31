/**
 * Share Utilities
 *
 * Reusable sharing functionality extracted from GameStage component.
 * Handles Web Share API and fallback to clipboard for sharing content.
 */

/**
 * Share content using Web Share API or fallback to clipboard
 *
 * @param title - Title of the shared content
 * @param text - Description text
 * @param url - URL to share
 * @returns Promise that resolves when sharing is complete
 */
export const shareChallenge = async (title: string, text: string, url: string): Promise<void> => {
	if (isShareSupported()) {
		try {
			await navigator.share({
				title,
				text,
				url,
			});
		} catch (error) {
			// User cancelled share or error occurred
			if (error instanceof Error && error.name !== "AbortError") {
				console.error("Share failed:", error);
				// Fallback to clipboard on error
				await copyToClipboard(url);
				throw new Error("링크가 클립보드에 복사되었습니다!");
			}
		}
	} else {
		// Web Share API not supported, fallback to clipboard
		await copyToClipboard(url);
		throw new Error("링크가 클립보드에 복사되었습니다!");
	}
};

/**
 * Copy text to clipboard
 *
 * @param text - Text to copy
 * @returns Promise that resolves when text is copied
 */
export const copyToClipboard = async (text: string): Promise<void> => {
	try {
		await navigator.clipboard.writeText(text);
	} catch (error) {
		console.error("Failed to copy to clipboard:", error);
		throw new Error("클립보드 복사에 실패했습니다");
	}
};

/**
 * Check if Web Share API is supported
 *
 * @returns true if Web Share API is supported
 */
export const isShareSupported = (): boolean => {
	return typeof navigator !== "undefined" && !!navigator.share;
};

/**
 * Share with specific platform (for future extension)
 *
 * @param platform - Platform to share on ('twitter', 'facebook', etc.)
 * @param url - URL to share
 * @param text - Text to share
 * @returns URL for sharing on the specified platform
 */
export const getShareUrl = (
	platform: "twitter" | "facebook" | "line",
	url: string,
	text?: string
): string => {
	const encodedUrl = encodeURIComponent(url);
	const encodedText = text ? encodeURIComponent(text) : "";

	switch (platform) {
		case "twitter":
			return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
		case "facebook":
			return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
		case "line":
			return `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`;
		default:
			return url;
	}
};
