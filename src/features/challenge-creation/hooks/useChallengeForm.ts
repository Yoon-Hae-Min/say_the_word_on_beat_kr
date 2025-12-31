/**
 * useChallengeForm Hook
 *
 * Custom hook for managing challenge creation form state.
 * Extracted from ChallengeCreationForm component.
 *
 * Follows Single Responsibility Principle - manages form state separate from UI rendering.
 */

import { useState } from "react";
import type { ChallengeData, Slot } from "@/entities/challenge";
import type { Resource } from "@/entities/resource";

const TOTAL_ROUNDS = 5;
const SLOTS_PER_ROUND = 8;

export interface UseChallengeFormReturn {
	/**
	 * Challenge data state
	 */
	challengeData: ChallengeData;

	/**
	 * Currently selected resource
	 */
	selectedResource: Resource | null;

	/**
	 * Event handlers
	 */
	handlers: {
		onTitleChange: (title: string) => void;
		onResourceUpload: (resource: Resource) => void;
		onResourceSelect: (resource: Resource) => void;
		onResourceNameChange: (id: string, name: string) => void;
		onResourceDelete: (id: string) => void;
		onSlotClick: (slotIndex: number) => void;
		onSlotClear: (slotIndex: number) => void;
		onShowNamesToggle: (showNames: boolean) => void;
	};

	/**
	 * Current round number (1-based)
	 */
	currentRound: number;

	/**
	 * Round navigation handlers
	 */
	roundHandlers: {
		setCurrentRound: (round: number) => void;
		goToPreviousRound: () => void;
		goToNextRound: () => void;
	};
}

/**
 * Custom hook for challenge form state management
 *
 * @param isPublic - Whether the challenge is public or private
 */
export const useChallengeForm = (isPublic: boolean): UseChallengeFormReturn => {
	// Initialize challenge data with empty rounds and slots
	const [challengeData, setChallengeData] = useState<ChallengeData>({
		title: "",
		rounds: Array(TOTAL_ROUNDS)
			.fill(null)
			.map((_, i) => ({
				id: i + 1,
				slots: Array(SLOTS_PER_ROUND)
					.fill(null)
					.map(
						(): Slot => ({
							resourceId: null,
						})
					),
			})),
		resources: [],
		isPublic,
		showNames: true,
	});

	const [currentRound, setCurrentRound] = useState(1);
	const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

	// Handler: Update title
	const handleTitleChange = (title: string) => {
		setChallengeData((prev) => ({ ...prev, title }));
	};

	// Handler: Add new resource
	const handleResourceUpload = (resource: Resource) => {
		setChallengeData((prev) => ({
			...prev,
			resources: [...prev.resources, resource],
		}));
	};

	// Handler: Select resource for placement
	const handleResourceSelect = (resource: Resource) => {
		setSelectedResource(resource);
	};

	// Handler: Update resource name
	const handleResourceNameChange = (id: string, name: string) => {
		setChallengeData((prev) => ({
			...prev,
			resources: prev.resources.map((r) => (r.id === id ? { ...r, name } : r)),
		}));
	};

	// Handler: Delete resource
	const handleResourceDelete = (id: string) => {
		setChallengeData((prev) => {
			// Remove resource from resources array
			const newResources = prev.resources.filter((r) => r.id !== id);

			// Clear slots that used this resource
			const newRounds = prev.rounds.map((round) => ({
				...round,
				slots: round.slots.map((slot) => (slot.resourceId === id ? { resourceId: null } : slot)),
			}));

			return {
				...prev,
				resources: newResources,
				rounds: newRounds,
			};
		});

		// Deselect if this resource was selected
		if (selectedResource?.id === id) {
			setSelectedResource(null);
		}
	};

	// Handler: Toggle show names option
	const handleShowNamesToggle = (showNames: boolean) => {
		setChallengeData((prev) => ({ ...prev, showNames }));
	};

	// Handler: Place selected resource in slot
	const handleSlotClick = (slotIndex: number) => {
		if (!selectedResource) {
			return;
		}

		setChallengeData((prev) => {
			const newRounds = [...prev.rounds];
			newRounds[currentRound - 1].slots[slotIndex] = {
				resourceId: selectedResource.id,
			};
			return { ...prev, rounds: newRounds };
		});
	};

	// Handler: Clear slot
	const handleSlotClear = (slotIndex: number) => {
		setChallengeData((prev) => {
			const newRounds = [...prev.rounds];
			newRounds[currentRound - 1].slots[slotIndex] = {
				resourceId: null,
			};
			return { ...prev, rounds: newRounds };
		});
	};

	// Handler: Go to previous round
	const goToPreviousRound = () => {
		if (currentRound > 1) {
			setCurrentRound(currentRound - 1);
		}
	};

	// Handler: Go to next round
	const goToNextRound = () => {
		if (currentRound < TOTAL_ROUNDS) {
			setCurrentRound(currentRound + 1);
		}
	};

	return {
		challengeData,
		selectedResource,
		handlers: {
			onTitleChange: handleTitleChange,
			onResourceUpload: handleResourceUpload,
			onResourceSelect: handleResourceSelect,
			onResourceNameChange: handleResourceNameChange,
			onResourceDelete: handleResourceDelete,
			onSlotClick: handleSlotClick,
			onSlotClear: handleSlotClear,
			onShowNamesToggle: handleShowNamesToggle,
		},
		currentRound,
		roundHandlers: {
			setCurrentRound,
			goToPreviousRound,
			goToNextRound,
		},
	};
};
