/**
 * useChallengeSubmission Hook
 *
 * Custom hook for handling challenge generation and submission.
 * Extracted from ChallengeCreationForm component.
 *
 * Coordinates validation and API calls for creating a challenge.
 */

import { useState } from "react";
import type { ChallengeData } from "@/entities/challenge";
import { createChallenge } from "../api/challengeService";
import { validateChallengeData } from "../lib/validation";

export interface UseChallengeSubmissionReturn {
	/**
	 * Whether the challenge is currently being uploaded
	 */
	isUploading: boolean;

	/**
	 * Error message if upload failed
	 */
	uploadError: string | null;

	/**
	 * ID of the generated challenge (after successful creation)
	 */
	generatedChallengeId: string;

	/**
	 * Whether the submission was successful
	 */
	isSuccess: boolean;

	/**
	 * Handle challenge generation/submission
	 */
	handleGenerate: (challengeData: ChallengeData) => Promise<boolean>;

	/**
	 * Reset submission state
	 */
	reset: () => void;
}

/**
 * Custom hook for challenge submission with validation
 *
 * @example
 * ```tsx
 * const submission = useChallengeSubmission();
 *
 * const handleSubmit = async () => {
 *   const success = await submission.handleGenerate(challengeData);
 *   if (success) {
 *     console.log('Challenge created:', submission.generatedChallengeId);
 *   }
 * };
 * ```
 */
export const useChallengeSubmission = (): UseChallengeSubmissionReturn => {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [generatedChallengeId, setGeneratedChallengeId] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);

	/**
	 * Handle challenge generation with validation
	 *
	 * @returns true if successful, false otherwise
	 */
	const handleGenerate = async (challengeData: ChallengeData): Promise<boolean> => {
		// Validate challenge data
		const validation = validateChallengeData(challengeData);
		if (!validation.isValid) {
			setUploadError(validation.errorMessage || "유효성 검사 실패");
			return false;
		}

		setIsUploading(true);
		setUploadError(null);

		try {
			// Upload images and create challenge in Supabase
			const challengeId = await createChallenge(challengeData);

			setGeneratedChallengeId(challengeId);
			setIsSuccess(true);
			return true;
		} catch (error) {
			console.error("Failed to create challenge:", error);
			const errorMessage = error instanceof Error ? error.message : "챌린지 생성에 실패했습니다";
			setUploadError(errorMessage);
			return false;
		} finally {
			setIsUploading(false);
		}
	};

	/**
	 * Reset submission state
	 */
	const reset = () => {
		setIsUploading(false);
		setUploadError(null);
		setGeneratedChallengeId("");
		setIsSuccess(false);
	};

	return {
		isUploading,
		uploadError,
		generatedChallengeId,
		isSuccess,
		handleGenerate,
		reset,
	};
};
