"use client";

import { useState } from "react";
import type { Challenge, ChallengeData, Slot } from "@/entities/challenge";
import type { Resource } from "@/entities/resource";
import { ChalkDust } from "@/shared/ui";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import ResourcePanel from "./ResourcePanel";
import RoundControl from "./RoundControl";
import StageGrid from "./StageGrid";
import SuccessModal from "./SuccessModal";

const TOTAL_ROUNDS = 5;
const SLOTS_PER_ROUND = 8;

interface ChallengeCreationFormProps {
	isPublic: boolean;
}

export default function ChallengeCreationForm({ isPublic }: ChallengeCreationFormProps) {
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
	});

	const [currentRound, setCurrentRound] = useState(1);
	const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
	const [generatedChallengeId, setGeneratedChallengeId] = useState("");

	// Handlers
	const handleTitleChange = (title: string) => {
		setChallengeData((prev) => ({ ...prev, title }));
	};

	const handleResourceUpload = (resource: Resource) => {
		setChallengeData((prev) => ({
			...prev,
			resources: [...prev.resources, resource],
		}));
	};

	const handleResourceSelect = (resource: Resource) => {
		setSelectedResource(resource);
	};

	const handleResourceNameChange = (id: string, name: string) => {
		setChallengeData((prev) => ({
			...prev,
			resources: prev.resources.map((r) => (r.id === id ? { ...r, name } : r)),
		}));
	};

	const handleSlotClick = (slotIndex: number) => {
		if (!selectedResource) {
			alert("먼저 우측에서 이미지를 선택하세요");
			return;
		}

		setChallengeData((prev) => {
			const newRounds = [...prev.rounds];
			newRounds[currentRound - 1].slots[slotIndex] = {
				resourceId: selectedResource.id,
			};
			return { ...prev, rounds: newRounds };
		});

		setSelectedResource(null);
	};

	const handlePreviousRound = () => {
		if (currentRound > 1) setCurrentRound(currentRound - 1);
	};

	const handleNextRound = () => {
		if (currentRound < TOTAL_ROUNDS) setCurrentRound(currentRound + 1);
	};

	const isValid = () => {
		if (!challengeData.title.trim()) return false;

		const allSlotsFilled = challengeData.rounds.every((round) =>
			round.slots.every((slot) => slot.resourceId !== null)
		);
		if (!allSlotsFilled) return false;

		const allResourcesNamed = challengeData.resources.every(
			(resource) => resource.name.trim() !== ""
		);
		if (!allResourcesNamed) return false;

		return true;
	};

	const handleGenerate = () => {
		if (!isValid()) {
			alert("모든 슬롯을 채우고 이미지 이름을 입력해주세요");
			return;
		}

		const newChallenge: Challenge = {
			id: crypto.randomUUID(),
			title: challengeData.title,
			thumbnail: challengeData.resources[0]?.imageUrl || "/placeholder.svg",
			viewCount: 0,
			isPublic: challengeData.isPublic,
			createdAt: new Date().toISOString(),
		};

		localStorage.setItem(
			`challenge_${newChallenge.id}`,
			JSON.stringify({
				...newChallenge,
				data: challengeData,
			})
		);

		setGeneratedChallengeId(newChallenge.id);
		setIsSuccessModalOpen(true);
	};

	return (
		<div className="min-h-screen bg-chalkboard-bg p-4 md:p-8">
			<ChalkDust position="top-left" intensity="low" color="white" />
			<ChalkDust position="bottom-right" intensity="low" color="yellow" />

			<div className="mx-auto max-w-7xl">
				<HeaderSection title={challengeData.title} onTitleChange={handleTitleChange} />

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						<div className="chalk-border chalk-dust border-chalk-blue bg-chalkboard-bg/50 p-6">
							<StageGrid
								slots={challengeData.rounds[currentRound - 1].slots}
								resources={challengeData.resources}
								selectedResource={selectedResource}
								onSlotClick={handleSlotClick}
							/>
						</div>

						<RoundControl
							currentRound={currentRound}
							totalRounds={TOTAL_ROUNDS}
							onPrevious={handlePreviousRound}
							onNext={handleNextRound}
						/>
					</div>

					<div className="lg:col-span-1">
						<div className="chalk-border chalk-dust border-chalk-white bg-chalkboard-bg/50 p-6 sticky top-4">
							<h3 className="chalk-text text-chalk-white text-xl mb-4">리소스 패널</h3>
							<ResourcePanel
								resources={challengeData.resources}
								selectedResource={selectedResource}
								onUpload={handleResourceUpload}
								onSelect={handleResourceSelect}
								onNameChange={handleResourceNameChange}
							/>
						</div>
					</div>
				</div>

				<FooterSection onGenerate={handleGenerate} disabled={!isValid()} />
			</div>

			<SuccessModal
				isOpen={isSuccessModalOpen}
				onClose={() => setIsSuccessModalOpen(false)}
				challengeId={generatedChallengeId}
				thumbnail={challengeData.resources[0]?.imageUrl || "/placeholder.svg"}
			/>
		</div>
	);
}
