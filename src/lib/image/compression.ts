import imageCompression from "browser-image-compression";

/**
 * Compression settings optimized for quick upload
 * - Max file size: 500KB
 * - Max dimension: 1280px
 * - Quality: 0.7
 */
const COMPRESSION_OPTIONS = {
	maxSizeMB: 0.5,
	maxWidthOrHeight: 1280,
	quality: 0.7,
	useWebWorker: true,
};

/**
 * Compress an image file for upload
 * @param file - Original image file
 * @returns Compressed image file
 */
export async function compressImage(file: File): Promise<File> {
	try {
		// Check if file is an image
		if (!file.type.startsWith("image/")) {
			throw new Error("File must be an image");
		}

		// Compress the image
		const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);

		// Return compressed file with original name
		return new File([compressedFile], file.name, {
			type: compressedFile.type,
		});
	} catch (error) {
		console.error("Image compression failed:", error);
		throw new Error(
			`Failed to compress image: ${error instanceof Error ? error.message : "Unknown error"}`
		);
	}
}

/**
 * Convert File to base64 data URL for preview
 * @param file - Image file
 * @returns Promise resolving to base64 data URL
 */
export function fileToDataURL(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			if (event.target?.result) {
				resolve(event.target.result as string);
			} else {
				reject(new Error("Failed to read file"));
			}
		};
		reader.onerror = () => reject(new Error("FileReader error"));
		reader.readAsDataURL(file);
	});
}
