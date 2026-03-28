import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type NextRequest, NextResponse } from "next/server";

interface PresignedUrlRequest {
	fileName: string;
	fileType: string;
}

interface PresignedUrlResponse {
	uploadUrl: string;
	publicUrl: string;
	path: string;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as PresignedUrlRequest;
		const { fileName, fileType } = body;

		// Validate input
		if (!fileName || !fileType) {
			return NextResponse.json({ error: "fileName and fileType are required" }, { status: 400 });
		}

		// Validate MIME type - whitelist only (blocks SVG, BMP, TIFF, etc.)
		if (!ALLOWED_MIME_TYPES.includes(fileType)) {
			return NextResponse.json(
				{ error: "Only JPEG, PNG, WebP, GIF files are allowed" },
				{ status: 400 },
			);
		}

		// Validate file extension - whitelist only (prevents .php, .svg, .html etc.)
		const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";
		if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
			return NextResponse.json({ error: "Invalid file extension" }, { status: 400 });
		}

		// Validate environment variables
		const accountId = process.env.R2_ACCOUNT_ID;
		const accessKeyId = process.env.R2_ACCESS_KEY_ID;
		const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
		const bucketName = process.env.R2_BUCKET_NAME;
		const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

		if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !r2PublicUrl) {
			console.error("Missing R2 environment variables");
			return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
		}

		// Generate unique file path (always use validated extension)
		const uniqueId = crypto.randomUUID();
		const path = `${uniqueId}.${fileExtension}`;

		// Initialize R2 client
		const r2Client = new S3Client({
			region: "auto",
			endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
		});

		// Create presigned URL for upload to R2 (120 second expiry - accounts for client-side compression)
		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: path,
			ContentType: fileType,
			CacheControl: "public, max-age=31536000, immutable",
		});

		const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 120 });
		const publicUrl = `${r2PublicUrl}/${path}`;

		const response: PresignedUrlResponse = {
			uploadUrl,
			publicUrl,
			path,
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error in presigned URL endpoint:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
