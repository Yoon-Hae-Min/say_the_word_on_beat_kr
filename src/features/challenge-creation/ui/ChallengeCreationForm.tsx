"use client";

import { useState } from "react";
import type { ChallengeData, Slot } from "@/entities/challenge";
import type { Resource } from "@/entities/resource";
import { ChalkDust } from "@/shared/ui";
import { createChallenge } from "../api/challengeService";
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

export default function ChallengeCreationForm({
  isPublic,
}: ChallengeCreationFormProps) {
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
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [generatedChallengeId, setGeneratedChallengeId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      alert("먼저 좌측에서 이미지를 선택하세요");
      return;
    }

    setChallengeData((prev) => {
      const newRounds = [...prev.rounds];
      newRounds[currentRound - 1].slots[slotIndex] = {
        resourceId: selectedResource.id,
      };
      return { ...prev, rounds: newRounds };
    });

    // Keep the resource selected for continuous placement
    // User must click another resource to deselect
  };

  const handleSlotClear = (slotIndex: number) => {
    setChallengeData((prev) => {
      const newRounds = [...prev.rounds];
      newRounds[currentRound - 1].slots[slotIndex] = {
        resourceId: null,
      };
      return { ...prev, rounds: newRounds };
    });
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

  const handleGenerate = async () => {
    if (!isValid()) {
      alert("모든 슬롯을 채우고 이미지 이름을 입력해주세요");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload images and create challenge in Supabase
      const challengeId = await createChallenge(challengeData);

      setGeneratedChallengeId(challengeId);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Failed to create challenge:", error);
      const errorMessage =
        error instanceof Error ? error.message : "챌린지 생성에 실패했습니다";
      setUploadError(errorMessage);
      alert(`오류: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-chalkboard-bg p-4 md:p-8">
      <ChalkDust position="top-left" intensity="low" color="white" />
      <ChalkDust position="bottom-right" intensity="low" color="yellow" />

      <div className="mx-auto max-w-[1600px] space-y-6 lg:space-y-0">
        {/* Title Input - Always on top */}
        <div className="border-2 border-dashed border-chalk-blue/50 bg-chalkboard-bg/50 rounded-md p-6 mb-6">
          <HeaderSection
            title={challengeData.title}
            onTitleChange={handleTitleChange}
          />
        </div>

        {/* Mobile: Resource Panel below title, Desktop: Side by side layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Panel - Resource Management (30% on desktop) */}
          <aside className="w-full lg:w-[30%] lg:min-w-[320px] order-1 lg:order-1">
            <div className="border-2 border-dashed border-chalk-blue/50 bg-chalkboard-bg/50 rounded-md p-6 lg:sticky lg:top-4">
              <h2 className="chalk-text text-chalk-white text-xl font-bold mb-1">
                이미지 관리
              </h2>
              <p className="text-chalk-white/60 text-sm mb-4">
                이미지를 업로드하고 이름을 지정하세요
              </p>
              <ResourcePanel
                resources={challengeData.resources}
                selectedResource={selectedResource}
                onUpload={handleResourceUpload}
                onSelect={handleResourceSelect}
                onNameChange={handleResourceNameChange}
              />
            </div>
          </aside>

          {/* Right Panel - Challenge Creation (70% on desktop) */}
          <main className="flex-1 order-2 lg:order-2 space-y-6 lg:space-y-8">
            {/* Stage Grid Section */}
            <div className="border-2 border-dashed border-chalk-blue/50 bg-chalkboard-bg/50 rounded-md p-6 lg:p-8">
              <div className="mb-6">
                <h2 className="chalk-text text-chalk-white text-xl lg:text-2xl font-bold mb-2 text-center">
                  라운드 {currentRound} / {TOTAL_ROUNDS}
                </h2>
                <p className="text-chalk-white/60 text-sm text-center">
                  이미지를 선택한 후 슬롯을 클릭하여 배치하세요
                </p>
              </div>

              <StageGrid
                slots={challengeData.rounds[currentRound - 1].slots}
                resources={challengeData.resources}
                onSlotClick={handleSlotClick}
                onSlotClear={handleSlotClear}
              />

              <div className="mt-6">
                <RoundControl
                  currentRound={currentRound}
                  totalRounds={TOTAL_ROUNDS}
                  onPrevious={handlePreviousRound}
                  onNext={handleNextRound}
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="border-2 border-dashed border-chalk-blue/50 bg-chalkboard-bg/50 rounded-md p-6">
              {uploadError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
                  <p className="text-chalk-white text-sm">{uploadError}</p>
                </div>
              )}
              <FooterSection
                onGenerate={handleGenerate}
                disabled={!isValid() || isUploading}
              />
              {isUploading && (
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

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        challengeId={generatedChallengeId}
        thumbnail={challengeData.resources[0]?.imageUrl || "/placeholder.svg"}
      />
    </div>
  );
}
