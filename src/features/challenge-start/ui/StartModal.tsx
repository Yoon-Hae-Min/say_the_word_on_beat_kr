"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChalkButton } from "@/shared/ui";

interface StartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StartModal({ isOpen, onClose }: StartModalProps) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [contentPolicyAgreed, setContentPolicyAgreed] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!agreed) return;
    if (visibility === "public" && !contentPolicyAgreed) return;
    router.push(`/maker?visibility=${visibility}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        role="button"
        tabIndex={-1}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-label="모달 닫기"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md animate-fade-in rounded-lg bg-chalkboard-bg p-8 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-chalk-white transition-colors hover:text-chalk-yellow"
          aria-label="닫기"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="chalk-text mb-6 text-3xl font-bold text-chalk-white">
          시작하기
        </h2>

        {/* Privacy selection */}
        <div className="mb-6">
          <p className="mb-3 text-lg text-chalk-white">공개 설정</p>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-md border-2 border-chalk-white/30 p-3 transition-colors hover:border-chalk-white/60">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={visibility === "public"}
                onChange={(e) =>
                  setVisibility(e.target.value as "public" | "private")
                }
                className="h-5 w-5 accent-chalk-yellow"
              />
              <div>
                <p className="text-chalk-white">공개</p>
                <p className="text-sm text-chalk-white/70">
                  다른 사람들이 내 챌린지를 볼 수 있습니다
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-md border-2 border-chalk-white/30 p-3 transition-colors hover:border-chalk-white/60">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === "private"}
                onChange={(e) =>
                  setVisibility(e.target.value as "public" | "private")
                }
                className="h-5 w-5 accent-chalk-yellow"
              />
              <div className="flex-1">
                <p className="text-chalk-white">비공개</p>
                <p className="text-sm text-chalk-white/70">
                  링크를 아는 사람만 볼 수 있습니다
                </p>
                <p className="text-xs text-chalk-yellow/80 mt-1">
                  ⚠️ 약 48시간 후 자동 삭제됩니다
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Terms agreement */}
        <div className="mb-6 space-y-3">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-chalk-yellow"
            />
            <p className="text-sm text-chalk-white/90">
              <Link
                href="/terms"
                target="_blank"
                className="text-chalk-yellow hover:underline font-bold"
                onClick={(e) => e.stopPropagation()}
              >
                서비스 이용약관
              </Link>
              {" 및 "}
              <Link
                href="/privacy"
                target="_blank"
                className="text-chalk-yellow hover:underline font-bold"
                onClick={(e) => e.stopPropagation()}
              >
                개인정보 처리방침
              </Link>
              에 동의합니다
            </p>
          </label>

          {/* Content policy agreement - only shown for public challenges */}
          {visibility === "public" && (
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={contentPolicyAgreed}
                onChange={(e) => setContentPolicyAgreed(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-chalk-yellow"
              />
              <p className="text-sm text-chalk-white/90">
                공개 챌린지에 적합하지 않은 콘텐츠는{" "}
                <span className="text-chalk-yellow font-bold">검토 후 삭제될 수 있음</span>을
                확인했습니다
              </p>
            </label>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <ChalkButton variant="white" onClick={onClose} className="flex-1">
            취소
          </ChalkButton>
          <ChalkButton
            variant="yellow"
            onClick={handleSubmit}
            disabled={!agreed || (visibility === "public" && !contentPolicyAgreed)}
            className="flex-1"
          >
            만들기 시작
          </ChalkButton>
        </div>
      </div>
    </div>
  );
}
