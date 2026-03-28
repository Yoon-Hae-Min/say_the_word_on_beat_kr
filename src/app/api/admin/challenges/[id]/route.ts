import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/shared/api/supabase/server";

interface ChallengeParams {
	params: Promise<{
		id: string;
	}>;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function createR2Client() {
	const accountId = process.env.R2_ACCOUNT_ID;
	const accessKeyId = process.env.R2_ACCESS_KEY_ID;
	const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
	const bucketName = process.env.R2_BUCKET_NAME;

	if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
		return null;
	}

	return {
		client: new S3Client({
			region: "auto",
			endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
			credentials: { accessKeyId, secretAccessKey },
		}),
		bucketName,
	};
}

/**
 * Extract all unique image paths from a challenge's game_config and thumbnail
 */
function extractImagePaths(challenge: {
	thumbnail_url: string | null;
	game_config: Array<{ slots: Array<{ imagePath: string | null }> | null }> | null;
}): string[] {
	const paths = new Set<string>();

	if (challenge.thumbnail_url) {
		paths.add(challenge.thumbnail_url);
	}

	if (challenge.game_config) {
		for (const round of challenge.game_config) {
			if (!round.slots) continue;
			for (const slot of round.slots) {
				if (slot.imagePath) {
					paths.add(slot.imagePath);
				}
			}
		}
	}

	return [...paths];
}

export async function DELETE(request: NextRequest, { params }: ChallengeParams) {
	try {
		const { id: challengeId } = await params;

		if (!challengeId || !UUID_REGEX.test(challengeId)) {
			return NextResponse.json({ error: "Invalid challenge ID" }, { status: 400 });
		}

		const body = await request.json().catch(() => ({}));
		const requestUserId = body.userId;

		if (!requestUserId || typeof requestUserId !== "string") {
			return NextResponse.json({ error: "User ID is required for verification" }, { status: 401 });
		}

		// 1. Fetch challenge data first (need image paths before deletion)
		const { data: challenge, error: fetchError } = await supabaseServer
			.from("challenges")
			.select("id, creator_id, thumbnail_url, game_config")
			.eq("id", challengeId)
			.single();

		if (fetchError || !challenge) {
			return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
		}

		if (challenge.creator_id !== requestUserId) {
			return NextResponse.json(
				{ error: "Unauthorized: You are not the creator of this challenge" },
				{ status: 403 },
			);
		}

		// 2. Extract image paths before DB deletion
		const imagePaths = extractImagePaths(challenge);

		// 3. Delete from DB with ownership re-check (atomic) + verify deletion
		const { data: deleted, error: deleteError } = await supabaseServer
			.from("challenges")
			.delete()
			.eq("id", challengeId)
			.eq("creator_id", requestUserId)
			.select("id")
			.single();

		if (deleteError || !deleted) {
			return NextResponse.json({ error: "Failed to delete challenge" }, { status: 500 });
		}

		// 4. Delete images from R2 (non-blocking — DB is already deleted)
		if (imagePaths.length > 0) {
			const r2 = createR2Client();
			if (r2) {
				try {
					await r2.client.send(
						new DeleteObjectsCommand({
							Bucket: r2.bucketName,
							Delete: {
								Objects: imagePaths.map((key) => ({ Key: key })),
							},
						}),
					);
				} catch (r2Error) {
					// R2 deletion failure should not fail the API response
					// DB is already deleted, orphan images are acceptable
					console.error("Failed to delete R2 images:", r2Error);
				}
			}
		}

		return NextResponse.json({ success: true, deletedImages: imagePaths.length });
	} catch (error) {
		console.error("Error in delete challenge endpoint:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest, { params }: ChallengeParams) {
	try {
		const { id: challengeId } = await params;

		if (!challengeId || !UUID_REGEX.test(challengeId)) {
			return NextResponse.json({ error: "Invalid challenge ID" }, { status: 400 });
		}

		const body = await request.json().catch(() => ({}));
		const requestUserId = body.userId;
		const isPublic = body.isPublic;

		if (!requestUserId || typeof requestUserId !== "string") {
			return NextResponse.json({ error: "User ID is required for verification" }, { status: 401 });
		}

		if (typeof isPublic !== "boolean") {
			return NextResponse.json({ error: "isPublic must be a boolean" }, { status: 400 });
		}

		// Atomic ownership check + update in a single query
		const { data, error: updateError } = await supabaseServer
			.from("challenges")
			.update({ is_public: isPublic })
			.eq("id", challengeId)
			.eq("creator_id", requestUserId)
			.select("id")
			.single();

		if (updateError || !data) {
			const { data: exists } = await supabaseServer
				.from("challenges")
				.select("id")
				.eq("id", challengeId)
				.single();

			if (!exists) {
				return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
			}

			return NextResponse.json(
				{ error: "Unauthorized: You are not the creator of this challenge" },
				{ status: 403 },
			);
		}

		return NextResponse.json({ success: true, isPublic });
	} catch (error) {
		console.error("Error in update challenge endpoint:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
