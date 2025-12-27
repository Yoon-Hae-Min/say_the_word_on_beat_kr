import { type NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/shared/api/supabase/server";

interface DeleteChallengeParams {
	params: Promise<{
		id: string;
	}>;
}

export async function DELETE(
	request: NextRequest,
	{ params }: DeleteChallengeParams,
) {
	try {
		const { id: challengeId } = await params;

		if (!challengeId) {
			return NextResponse.json(
				{ error: "Challenge ID is required" },
				{ status: 400 },
			);
		}

		const body = await request.json().catch(() => ({}));
		const requestUserId = body.userId;

		if (!requestUserId) {
			return NextResponse.json(
				{ error: "User ID is required for verification" },
				{ status: 401 },
			);
		}

		// Verify ownership
		const { data: challenge, error: fetchError } = await supabaseServer
			.from("challenges")
			.select("id, creator_id, title")
			.eq("id", challengeId)
			.single();

		if (fetchError || !challenge) {
			return NextResponse.json(
				{ error: "Challenge not found" },
				{ status: 404 },
			);
		}

		if (challenge.creator_id !== requestUserId) {
			return NextResponse.json(
				{ error: "Unauthorized: You are not the creator of this challenge" },
				{ status: 403 },
			);
		}

		// Delete challenge
		const { error: deleteError } = await supabaseServer
			.from("challenges")
			.delete()
			.eq("id", challengeId);

		if (deleteError) {
			return NextResponse.json(
				{ error: "Failed to delete challenge" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error in delete challenge endpoint:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
