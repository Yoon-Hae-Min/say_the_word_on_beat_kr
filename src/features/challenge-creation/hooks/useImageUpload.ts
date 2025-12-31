/**
 * useImageUpload Hook
 *
 * Custom hook for handling image file uploads with compression.
 * Extracted from ResourcePanel component.
 *
 * Responsibilities:
 * - File compression orchestration
 * - Process image files from upload/paste
 * - Manage compression state
 */

import { useState } from "react";
import type { Resource } from "@/entities/resource";
import { compressImage, fileToDataURL } from "@/shared/lib/image";

export interface UseImageUploadReturn {
	/**
	 * Whether images are currently being compressed
	 */
	isCompressing: boolean;

	/**
	 * Process multiple image files (compress and convert to resources)
	 */
	processImageFiles: (files: File[]) => Promise<Resource[]>;

	/**
	 * Handle file input change event
	 */
	handleFileChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		onUpload: (resource: Resource) => void
	) => Promise<void>;
}

/**
 * Custom hook for image upload and compression
 *
 * @example
 * ```tsx
 * const { isCompressing, processImageFiles, handleFileChange } = useImageUpload();
 *
 * const handleUpload = async (files: File[]) => {
 *   const resources = await processImageFiles(files);
 *   // Do something with resources...
 * };
 * ```
 */
export const useImageUpload = (): UseImageUploadReturn => {
	const [isCompressing, setIsCompressing] = useState(false);

	/**
	 * Process image files: compress and convert to Resource objects
	 */
	const processImageFiles = async (files: File[]): Promise<Resource[]> => {
		if (files.length === 0) return [];

		setIsCompressing(true);
		const resources: Resource[] = [];

		try {
			for (const file of files) {
				// Validate file type
				if (!file.type.startsWith("image/")) {
					console.warn(`Skipping non-image file: ${file.name}`);
					continue;
				}

				try {
					// Compress the image
					const compressedFile = await compressImage(file);

					// Convert to data URL for preview
					const dataUrl = await fileToDataURL(compressedFile);

					// Create resource object
					const newResource: Resource = {
						id: crypto.randomUUID(),
						imageUrl: dataUrl,
						name: "",
						file: compressedFile,
					};

					resources.push(newResource);
				} catch (error) {
					console.error(`Error processing image ${file.name}:`, error);
					// Continue processing other files
				}
			}
		} finally {
			setIsCompressing(false);
		}

		return resources;
	};

	/**
	 * Handle file input change event
	 */
	const handleFileChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
		onUpload: (resource: Resource) => void
	): Promise<void> => {
		const files = e.target.files;
		if (!files) return;

		const resources = await processImageFiles(Array.from(files));

		// Call onUpload for each successfully processed resource
		resources.forEach((resource) => {
			onUpload(resource);
		});

		// Reset input to allow uploading the same file again
		e.target.value = "";
	};

	return {
		isCompressing,
		processImageFiles,
		handleFileChange,
	};
};
