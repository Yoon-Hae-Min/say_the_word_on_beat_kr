import type { BeatSlot, ChallengeData, GameConfigStruct } from "@/entities/challenge";
import { createChallenge as createChallengeInDB } from "@/entities/challenge";
import { supabase } from "@/shared/api/supabase/client";
import { sendGAEvent } from "@/shared/lib/analytics/gtag";
import { compressImage } from "@/shared/lib/image";
import { getUserId } from "@/shared/lib/user/fingerprint";

interface PresignedUrlResponse {
	uploadUrl: string;
}

/**
 * Request a presigned URL from Supabase Edge Function
 */
async function getPresignedUrl(
	fileName: string,
	contentType: string
): Promise<PresignedUrlResponse> {
	const { data: sessionData } = await supabase.auth.getSession();

	const response = await fetch(
		"https://dnldvqkwlbvhspvpduqc.supabase.co/functions/v1/r2-presigned-url",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${sessionData?.session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
			},
			body: JSON.stringify({ fileName, contentType }),
		}
	);

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || "Failed to get presigned URL");
	}

	return response.json();
}

/**
 * Generate unique filename with UUID
 */
function generateUniqueFileName(originalFileName: string): string {
	const fileExtension = originalFileName.split(".").pop() || "jpg";
	const uniqueId = crypto.randomUUID();
	return `${uniqueId}.${fileExtension}`;
}

/**
 * Upload a file using a presigned URL
 */
async function uploadToPresignedUrl(presignedUrl: string, file: File): Promise<void> {
	const response = await fetch(presignedUrl, {
		method: "PUT",
		body: file,
		headers: {
			"Content-Type": file.type,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to upload file to storage");
	}
}

/**
 * Compress and upload an image to R2 storage
 * @param file - Original image file
 * @returns Path to the uploaded image in storage
 */
export async function compressAndUploadImage(file: File): Promise<string> {
	try {
		// Step 1: Compress the image
		const compressedFile = await compressImage(file);

		// Step 2: Generate unique filename (UUID-based)
		const uniqueFileName = generateUniqueFileName(compressedFile.name);

		// Step 3: Get presigned URL from edge function
		const { uploadUrl } = await getPresignedUrl(uniqueFileName, compressedFile.type);

		// Step 4: Upload to R2 using presigned URL
		await uploadToPresignedUrl(uploadUrl, compressedFile);

		// Step 5: Return the unique filename
		return uniqueFileName;
	} catch (error) {
		console.error("Error uploading image:", error);
		throw new Error(
			`Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`
		);
	}
}

/**
 * Create a new challenge in the database
 * @param challengeData - Challenge data from the form
 * @returns Challenge ID
 */
export async function createChallenge(challengeData: ChallengeData): Promise<string> {
	try {
		// Step 1: Upload all resource images and get their storage paths
		const uploadPromises = challengeData.resources.map(async (resource) => {
			if (!resource.file) {
				throw new Error(`Resource ${resource.name} is missing file`);
			}
			const path = await compressAndUploadImage(resource.file);
			return {
				resourceId: resource.id,
				path,
				// Only set displayText if showNames is enabled
				displayText: challengeData.showNames ? resource.name : null,
			};
		});

		const uploadedResources = await Promise.all(uploadPromises);

		// Create a map for quick lookup
		const resourcePathMap = new Map(uploadedResources.map((r) => [r.resourceId, r]));

		// Step 2: Build game_config array structure matching database schema
		const gameConfig: GameConfigStruct[] = challengeData.rounds.map((round) => ({
			roundIndex: round.id,
			slots: round.slots.map((slot): BeatSlot => {
				if (!slot.resourceId) {
					return {
						imagePath: null,
						displayText: null,
					};
				}
				const uploadedResource = resourcePathMap.get(slot.resourceId);
				if (!uploadedResource) {
					return {
						imagePath: null,
						displayText: null,
					};
				}

				return {
					imagePath: uploadedResource.path,
					displayText: uploadedResource.displayText,
				};
			}),
		}));

		// Get thumbnail from first slot of first round
		const thumbnailUrl = gameConfig[0]?.slots?.[0]?.imagePath || null;

		// Get user ID (browser fingerprint)
		const creatorId = getUserId();

		// Step 3: Insert challenge into database
		const result = await createChallengeInDB({
			title: challengeData.title,
			isPublic: challengeData.isPublic,
			showNames: challengeData.showNames,
			thumbnailUrl: thumbnailUrl ?? undefined,
			gameConfig,
			creatorId,
		});

		// Step 4: Send GA event
		sendGAEvent({
			action: "create_challenge",
			category: "engagement",
			label: challengeData.isPublic ? "public" : "private",
			value: 1,
			user_id: creatorId,
			challenge_id: result.id,
		});

		return result.id;
	} catch (error) {
		console.error("Error creating challenge:", error);
		throw new Error(
			`Failed to create challenge: ${error instanceof Error ? error.message : "Unknown error"}`
		);
	}
}
