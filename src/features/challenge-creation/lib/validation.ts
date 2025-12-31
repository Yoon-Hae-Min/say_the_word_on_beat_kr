/**
 * Challenge Creation Validation Service
 *
 * Pure validation functions extracted from ChallengeCreationForm component.
 * Following Single Responsibility Principle - separate business logic from UI.
 */

import type { ChallengeData } from "@/entities/challenge";
import type { Resource } from "@/entities/resource";

export interface ValidationResult {
	isValid: boolean;
	errorMessage?: string;
}

/**
 * Validate challenge title
 */
export const validateChallengeTitle = (title: string): ValidationResult => {
	const trimmedTitle = title.trim();

	if (!trimmedTitle) {
		return {
			isValid: false,
			errorMessage: "챌린지 제목을 입력해주세요",
		};
	}

	if (trimmedTitle.length < 2) {
		return {
			isValid: false,
			errorMessage: "제목은 최소 2자 이상이어야 합니다",
		};
	}

	if (trimmedTitle.length > 50) {
		return {
			isValid: false,
			errorMessage: "제목은 최대 50자까지 입력 가능합니다",
		};
	}

	return { isValid: true };
};

/**
 * Validate that all slots are filled with resources
 */
export const validateAllSlotsFilled = (rounds: ChallengeData["rounds"]): ValidationResult => {
	const allSlotsFilled = rounds.every((round) =>
		round.slots.every((slot) => slot.resourceId !== null)
	);

	if (!allSlotsFilled) {
		return {
			isValid: false,
			errorMessage: "모든 슬롯에 이미지를 배치해주세요",
		};
	}

	return { isValid: true };
};

/**
 * Validate resource names (only when showNames is enabled)
 */
export const validateResourceNames = (
	resources: Resource[],
	showNames: boolean
): ValidationResult => {
	// Skip validation if names are not being shown
	if (!showNames) {
		return { isValid: true };
	}

	const allResourcesNamed = resources.every((resource) => resource.name.trim() !== "");

	if (!allResourcesNamed) {
		return {
			isValid: false,
			errorMessage: "이름 표시가 활성화되어 있습니다. 모든 이미지에 이름을 입력해주세요",
		};
	}

	// Check for duplicate names
	const names = resources.map((r) => r.name.trim().toLowerCase());
	const hasDuplicates = names.length !== new Set(names).size;

	if (hasDuplicates) {
		return {
			isValid: false,
			errorMessage: "중복된 이미지 이름이 있습니다",
		};
	}

	return { isValid: true };
};

/**
 * Validate entire challenge data
 *
 * Orchestrates all validation rules and returns overall result
 */
export const validateChallengeData = (data: ChallengeData): ValidationResult => {
	// Validate title
	const titleValidation = validateChallengeTitle(data.title);
	if (!titleValidation.isValid) {
		return titleValidation;
	}

	// Validate all slots filled
	const slotsValidation = validateAllSlotsFilled(data.rounds);
	if (!slotsValidation.isValid) {
		return slotsValidation;
	}

	// Validate resource names (if showNames is enabled)
	const namesValidation = validateResourceNames(data.resources, data.showNames);
	if (!namesValidation.isValid) {
		return namesValidation;
	}

	return { isValid: true };
};
