import type {
	ChallengeData,
	GameConfigStruct,
	BeatSlot,
} from "@/entities/challenge";
import { createChallenge as createChallengeInDB } from "@/entities/challenge";
import { compressImage } from "@/shared/lib/image";

interface PresignedUrlResponse {
	uploadUrl: string;
	publicUrl: string;
	path: string;
}

/**
 * Request a presigned URL from the server
 */
async function getPresignedUrl(
	fileName: string,
	fileType: string
): Promise<PresignedUrlResponse> {
	const response = await fetch("/api/upload/presigned-url", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ fileName, fileType }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || "Failed to get presigned URL");
	}

	return response.json();
}

/**
 * Upload a file using a presigned URL
 */
async function uploadToPresignedUrl(
	presignedUrl: string,
	file: File
): Promise<void> {
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
 * Compress and upload an image to Supabase storage
 * @param file - Original image file
 * @returns Path to the uploaded image in storage
 */
export async function compressAndUploadImage(file: File): Promise<string> {
	try {
		// Step 1: Compress the image
		const compressedFile = await compressImage(file);

		// Step 2: Get presigned URL
		const { uploadUrl, path } = await getPresignedUrl(
			compressedFile.name,
			compressedFile.type
		);

		// Step 3: Upload to storage using presigned URL
		await uploadToPresignedUrl(uploadUrl, compressedFile);

		// Step 4: Return the storage path
		return path;
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
export async function createChallenge(
	challengeData: ChallengeData
): Promise<string> {
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
				displayText: resource.name,
			};
		});

		const uploadedResources = await Promise.all(uploadPromises);

		// Create a map for quick lookup
		const resourcePathMap = new Map(
			uploadedResources.map((r) => [r.resourceId, r])
		);

		// Step 2: Build game_config array structure matching database schema
		const gameConfig: GameConfigStruct[] = challengeData.rounds.map(
			(round) => ({
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
			})
		);

		// Get thumbnail from first slot of first round
		const thumbnailUrl = gameConfig[0]?.slots?.[0]?.imagePath || null;

		// Step 3: Insert challenge into database
		const result = await createChallengeInDB({
			title: challengeData.title,
			isPublic: challengeData.isPublic,
			thumbnailUrl,
			gameConfig,
		});

		return result.id;
	} catch (error) {
		console.error("Error creating challenge:", error);
		throw new Error(
			`Failed to create challenge: ${error instanceof Error ? error.message : "Unknown error"}`
		);
	}
}
