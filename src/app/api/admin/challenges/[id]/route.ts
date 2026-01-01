import { type NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/shared/api/supabase/server";

interface ChallengeParams {
	params: Promise<{
		id: string;
	}>;
}

export async function DELETE(request: NextRequest, { params }: ChallengeParams) {
	try {
		const { id: challengeId } = await params;

		if (!challengeId) {
			return NextResponse.json({ error: "Challenge ID is required" }, { status: 400 });
		}

		const body = await request.json().catch(() => ({}));
		const requestUserId = body.userId;

		if (!requestUserId) {
			return NextResponse.json({ error: "User ID is required for verification" }, { status: 401 });
		}

		// Verify ownership
		const { data: challenge, error: fetchError } = await supabaseServer
			.from("challenges")
			.select("id, creator_id, title")
			.eq("id", challengeId)
			.single();

		if (fetchError || !challenge) {
			return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
		}

		if (challenge.creator_id !== requestUserId) {
			return NextResponse.json(
				{ error: "Unauthorized: You are not the creator of this challenge" },
				{ status: 403 }
			);
		}

		// Delete challenge
		const { error: deleteError } = await supabaseServer
			.from("challenges")
			.delete()
			.eq("id", challengeId);

		if (deleteError) {
			return NextResponse.json({ error: "Failed to delete challenge" }, { status: 500 });
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

		if (!challengeId) {
			return NextResponse.json({ error: "Challenge ID is required" }, { status: 400 });
		}

		const body = await request.json().catch(() => ({}));
		const requestUserId = body.userId;
		const isPublic = body.isPublic;

		if (!requestUserId) {
			return NextResponse.json({ error: "User ID is required for verification" }, { status: 401 });
		}

		if (typeof isPublic !== "boolean") {
			return NextResponse.json({ error: "isPublic must be a boolean" }, { status: 400 });
		}

		// Verify ownership
		const { data: challenge, error: fetchError } = await supabaseServer
			.from("challenges")
			.select("id, creator_id, title")
			.eq("id", challengeId)
			.single();

		if (fetchError || !challenge) {
			return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
		}

		if (challenge.creator_id !== requestUserId) {
			return NextResponse.json(
				{ error: "Unauthorized: You are not the creator of this challenge" },
				{ status: 403 }
			);
		}

		// Update challenge public status
		const { error: updateError } = await supabaseServer
			.from("challenges")
			.update({ is_public: isPublic })
			.eq("id", challengeId);

		if (updateError) {
			return NextResponse.json({ error: "Failed to update challenge" }, { status: 500 });
		}

		return NextResponse.json({ success: true, isPublic });
	} catch (error) {
		console.error("Error in update challenge endpoint:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
