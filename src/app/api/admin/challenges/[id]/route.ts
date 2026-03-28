import { type NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/shared/api/supabase/server";

interface ChallengeParams {
	params: Promise<{
		id: string;
	}>;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(request: NextRequest, { params }: ChallengeParams) {
	try {
		const { id: challengeId } = await params;

		// Validate UUID format to prevent injection
		if (!challengeId || !UUID_REGEX.test(challengeId)) {
			return NextResponse.json({ error: "Invalid challenge ID" }, { status: 400 });
		}

		const body = await request.json().catch(() => ({}));
		const requestUserId = body.userId;

		if (!requestUserId || typeof requestUserId !== "string") {
			return NextResponse.json({ error: "User ID is required for verification" }, { status: 401 });
		}

		// Atomic ownership check + delete in a single query
		// Only deletes if creator_id matches, preventing race conditions
		const { data, error: deleteError } = await supabaseServer
			.from("challenges")
			.delete()
			.eq("id", challengeId)
			.eq("creator_id", requestUserId)
			.select("id")
			.single();

		if (deleteError || !data) {
			// Check if challenge exists at all
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

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error in delete challenge endpoint:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest, { params }: ChallengeParams) {
	try {
		const { id: challengeId } = await params;

		// Validate UUID format
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
