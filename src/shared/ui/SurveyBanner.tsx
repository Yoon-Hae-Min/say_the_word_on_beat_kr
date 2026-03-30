"use client";

import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { trackSurveyAction } from "@/shared/lib/analytics/gtag";

const SURVEY_URL = "https://forms.gle/ut9ve66jxxMJpJU86";
const STORAGE_KEY = "survey_state";
const DISMISS_DAYS = 7;

interface SurveyState {
	dismissed: boolean;
	dismissedAt: number | null;
	completed: boolean;
}

function getSurveyState(): SurveyState {
	if (typeof window === "undefined")
		return { dismissed: false, dismissedAt: null, completed: false };
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return { dismissed: false, dismissedAt: null, completed: false };
		return JSON.parse(stored);
	} catch {
		return { dismissed: false, dismissedAt: null, completed: false };
	}
}

function saveSurveyState(state: SurveyState) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {
		// ignore
	}
}

function shouldShowSurvey(): boolean {
	const state = getSurveyState();
	if (state.completed) return false;
	if (!state.dismissed) return true;
	if (!state.dismissedAt) return true;

	const daysSinceDismiss = (Date.now() - state.dismissedAt) / (1000 * 60 * 60 * 24);
	return daysSinceDismiss >= DISMISS_DAYS;
}

export default function SurveyBanner() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (shouldShowSurvey()) {
			setVisible(true);
			trackSurveyAction("shown");
		}
	}, []);

	const handleClick = () => {
		trackSurveyAction("clicked");
		window.open(SURVEY_URL, "_blank", "noopener,noreferrer");
	};

	const handleDismiss = () => {
		trackSurveyAction("dismissed");
		saveSurveyState({ dismissed: true, dismissedAt: Date.now(), completed: false });
		setVisible(false);
	};

	if (!visible) return null;

	return (
		<div className="animate-fade-in w-full rounded-lg border border-chalk-yellow/30 bg-chalk-yellow/10 p-4">
			<div className="flex items-start gap-3">
				<MessageCircle className="mt-0.5 shrink-0 text-chalk-yellow" size={20} />
				<div className="min-w-0 flex-1">
					<p className="chalk-text text-sm font-bold text-chalk-yellow">
						2분만 시간 주실 수 있나요?
					</p>
					<p className="mt-1 text-xs leading-relaxed text-chalk-white/70">
						개발자가 직접 읽는 짧은 설문이에요. 여러분의 답변이 이 서비스의 방향을 바꿀 수 있어요!
					</p>
					<button
						type="button"
						onClick={handleClick}
						className="chalk-text mt-2 inline-flex items-center gap-1 rounded-md bg-chalk-yellow/20 px-3 py-1.5 text-sm text-chalk-yellow transition-colors hover:bg-chalk-yellow/30"
					>
						설문 참여하기
					</button>
				</div>
				<button
					type="button"
					onClick={handleDismiss}
					className="shrink-0 rounded p-1 text-chalk-white/40 transition-colors hover:text-chalk-white/70"
					aria-label="설문 배너 닫기"
				>
					<X size={16} />
				</button>
			</div>
		</div>
	);
}
