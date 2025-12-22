"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import FooterSection from "@/components/maker/FooterSection";
import HeaderSection from "@/components/maker/HeaderSection";
import ResourcePanel from "@/components/maker/ResourcePanel";
import RoundControl from "@/components/maker/RoundControl";
import StageGrid from "@/components/maker/StageGrid";
import SuccessModal from "@/components/modals/SuccessModal";
import ChalkDust from "@/components/ui/ChalkDust";
import WoodFrame from "@/components/ui/WoodFrame";
import type { Challenge, ChallengeData, Slot } from "@/types/challenge";
import type { Resource } from "@/types/resource";

const TOTAL_ROUNDS = 5;
const SLOTS_PER_ROUND = 8;

function MakerContent() {
	const searchParams = useSearchParams();
	const visibility = searchParams.get("visibility") || "public";

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
		isPublic: visibility === "public",
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
		// 제목 검증
		if (!challengeData.title.trim()) return false;

		// 모든 슬롯 채워졌는지 검증
		const allSlotsFilled = challengeData.rounds.every((round) =>
			round.slots.every((slot) => slot.resourceId !== null)
		);
		if (!allSlotsFilled) return false;

		// 모든 리소스에 이름이 있는지 검증
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

		// Create new challenge
		const newChallenge: Challenge = {
			id: crypto.randomUUID(),
			title: challengeData.title,
			thumbnail: challengeData.resources[0]?.imageUrl || "/placeholder.svg",
			viewCount: 0,
			isPublic: challengeData.isPublic,
			createdAt: new Date().toISOString(),
		};

		// Save to localStorage (mock)
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
		<WoodFrame>
			<div className="min-h-screen bg-chalkboard-bg p-4 md:p-8">
				{/* Decorative dust */}
				<ChalkDust position="top-left" intensity="low" color="white" />
				<ChalkDust position="bottom-right" intensity="low" color="yellow" />

				<div className="mx-auto max-w-7xl">
					{/* Header */}
					<HeaderSection title={challengeData.title} onTitleChange={handleTitleChange} />

					{/* Main content */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Stage + Round Control (2/3 width on desktop) */}
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

						{/* Resource Panel (1/3 width on desktop) */}
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

					{/* Footer */}
					<FooterSection onGenerate={handleGenerate} disabled={!isValid()} />
				</div>

				{/* Success Modal */}
				<SuccessModal
					isOpen={isSuccessModalOpen}
					onClose={() => setIsSuccessModalOpen(false)}
					challengeId={generatedChallengeId}
					thumbnail={challengeData.resources[0]?.imageUrl || "/placeholder.svg"}
				/>
			</div>
		</WoodFrame>
	);
}

export default function MakerPage() {
	return (
		<Suspense
			fallback={
				<WoodFrame>
					<div className="min-h-screen bg-chalkboard-bg flex items-center justify-center">
						<p className="chalk-text text-chalk-white text-2xl">로딩 중...</p>
					</div>
				</WoodFrame>
			}
		>
			<MakerContent />
		</Suspense>
	);
}
