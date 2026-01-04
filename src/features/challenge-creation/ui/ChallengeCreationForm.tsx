/**
 * ChallengeCreationForm Component (Refactored)
 *
 * Main form for creating challenges.
 * Refactored to use custom hooks and composition of smaller components.
 *
 * This is the refactored version that will replace the original ChallengeCreationForm.tsx
 */

"use client";

import { ChalkDust, ErrorDisplay } from "@/shared/ui";
import { useChallengeForm } from "../hooks/useChallengeForm";
import { useChallengeSubmission } from "../hooks/useChallengeSubmission";
import { calculateUniqueImagesUsed } from "../lib/validation";
import FooterSection from "./FooterSection";
import HeaderSection from "./HeaderSection";
import NameToggleControl from "./NameToggleControl";
import ResourcePanel from "./ResourcePanel";
import RoundControl from "./RoundControl";
import StageGrid from "./StageGrid";
import SuccessScreen from "./SuccessScreen";

const TOTAL_ROUNDS = 5;

interface ChallengeCreationFormProps {
	isPublic: boolean;
}

export default function ChallengeCreationForm({ isPublic }: ChallengeCreationFormProps) {
	// Use custom hooks for state management
	const form = useChallengeForm(isPublic);
	const submission = useChallengeSubmission();

	// Calculate unique images used in real-time
	const uniqueImagesUsed = calculateUniqueImagesUsed(form.challengeData.rounds);
	const needsMoreImages = uniqueImagesUsed < 3;

	// Handle challenge generation
	const handleGenerate = async () => {
		const success = await submission.handleGenerate(form.challengeData);

		if (!success && submission.uploadError) {
			// Show error alert
			alert(`오류: ${submission.uploadError}`);
		}
	};

	// Show success screen after challenge creation
	if (submission.isSuccess) {
		return (
			<SuccessScreen
				challengeId={submission.generatedChallengeId}
				thumbnail={form.challengeData.resources[0]?.imageUrl || "/placeholder.svg"}
			/>
		);
	}

	// Show challenge creation form
	return (
		<div className="min-h-screen bg-chalkboard-bg p-4 md:p-8">
			<ChalkDust position="top-left" intensity="low" color="white" />
			<ChalkDust position="bottom-right" intensity="low" color="yellow" />

			<div className="mx-auto max-w-[1600px] space-y-6 lg:space-y-0">
				{/* Title Input - Always on top */}
				<div className="border-2 border-dashed border-chalk-blue/50 bg-chalkboard-bg/50 rounded-md p-6 mb-6">
					<HeaderSection
						title={form.challengeData.title}
						onTitleChange={form.handlers.onTitleChange}
					/>
				</div>

				{/* Mobile: Resource Panel below title, Desktop: Side by side layout */}
				<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
					{/* Left Panel - Resource Management (30% on desktop) */}
					<aside className="w-full lg:w-[30%] lg:min-w-[320px] order-1 lg:order-1">
						<div className="border-2 border-dashed border-chalk-blue/50 bg-chalkboard-bg/50 rounded-md p-6 lg:sticky lg:top-4">
							<h2 className="chalk-text text-chalk-white text-xl font-bold mb-1">이미지 관리</h2>
							<p className="text-chalk-white/60 text-sm mb-4">
								이미지를 업로드하고 이름을 지정하세요
							</p>

							{/* Name Display Toggle */}
							<NameToggleControl
								showNames={form.challengeData.showNames}
								onToggle={form.handlers.onShowNamesToggle}
								className="mb-4"
							/>

							<ResourcePanel
								resources={form.challengeData.resources}
								selectedResource={form.selectedResource}
								onUpload={form.handlers.onResourceUpload}
								onSelect={form.handlers.onResourceSelect}
								onNameChange={form.handlers.onResourceNameChange}
								onDelete={form.handlers.onResourceDelete}
								showNames={form.challengeData.showNames}
							/>
						</div>
					</aside>

					{/* Right Panel - Challenge Creation (70% on desktop) */}
					<main className="flex-1 order-2 lg:order-2 space-y-6 lg:space-y-8">
						{/* Stage Grid Section */}
						<div className="border-2 border-dashed border-chalk-blue/50 bg-chalkboard-bg/50 rounded-md p-6 lg:p-8">
							<div className="mb-6">
								<h2 className="chalk-text text-chalk-white text-xl lg:text-2xl font-bold mb-2 text-center">
									라운드 {form.currentRound} / {TOTAL_ROUNDS}
								</h2>
								<p className="text-chalk-white/60 text-sm text-center">
									{form.selectedResource
										? "슬롯을 클릭하여 이미지를 배치하세요"
										: "먼저 좌측에서 이미지를 선택하세요"}
								</p>
							</div>

							<StageGrid
								slots={form.challengeData.rounds[form.currentRound - 1].slots}
								resources={form.challengeData.resources}
								onSlotClick={(slotIndex) => {
									if (!form.selectedResource) {
										alert("먼저 좌측에서 이미지를 선택하세요");
										return;
									}
									form.handlers.onSlotClick(slotIndex);
								}}
								onSlotClear={form.handlers.onSlotClear}
								showNames={form.challengeData.showNames}
							/>

							{/* Real-time validation warning */}
							{needsMoreImages && uniqueImagesUsed > 0 && (
								<div className="mt-4 rounded-lg border-2 border-chalk-yellow/50 bg-chalk-yellow/10 p-3">
									<p className="text-sm text-chalk-yellow text-center">
										⚠️ 최소 3개의 서로 다른 이미지를 사용해야 합니다 (현재: {uniqueImagesUsed}개)
									</p>
								</div>
							)}

							<div className="mt-6">
								<RoundControl
									currentRound={form.currentRound}
									totalRounds={TOTAL_ROUNDS}
									onPrevious={form.roundHandlers.goToPreviousRound}
									onNext={form.roundHandlers.goToNextRound}
								/>
							</div>
						</div>

						{/* Generate Button */}
						<div className="border-2 border-dashed border-chalk-blue/50 bg-chalkboard-bg/50 rounded-md p-6">
							{submission.uploadError && (
								<ErrorDisplay message={submission.uploadError} className="mb-4" />
							)}
							<FooterSection onGenerate={handleGenerate} disabled={submission.isUploading} />
							{submission.isUploading && (
								<div className="mt-4 text-center">
									<p className="chalk-text text-chalk-yellow text-sm animate-pulse">
										이미지 업로드 중... 잠시만 기다려주세요
									</p>
								</div>
							)}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
