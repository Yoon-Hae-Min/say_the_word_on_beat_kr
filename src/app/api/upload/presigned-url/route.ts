import { supabaseServer } from "@/shared/api/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
}

interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  path: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PresignedUrlRequest;
    const { fileName, fileType } = body;

    // Validate input
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "fileName and fileType are required" },
        { status: 400 }
      );
    }

    // Validate file type (only allow images)
    if (!fileType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Generate unique file path
    const fileExtension = fileName.split(".").pop() || "jpg";
    const uniqueId = crypto.randomUUID();
    const path = `${uniqueId}.${fileExtension}`;

    // Create presigned URL for upload (60 second expiry)
    const { data: signedData, error: signError } = await supabaseServer.storage
      .from("challenge-images")
      .createSignedUploadUrl(path, {
        upsert: false,
      });

    if (signError || !signedData) {
      console.error("Error creating presigned URL:", signError);
      return NextResponse.json(
        { error: "Failed to generate upload URL" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicData } = supabaseServer.storage
      .from("challenge-images")
      .getPublicUrl(path);

    const response: PresignedUrlResponse = {
      uploadUrl: signedData.signedUrl,
      publicUrl: publicData.publicUrl,
      path,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in presigned URL endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
