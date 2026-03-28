// Google Analytics 이벤트 전송 헬퍼 함수

export const GA_ID = "G-XR0CC6JPB7";

type GTagEvent = {
	action: string;
	category: string;
	label?: string;
	value?: number;
	user_id?: string;
	[key: string]: string | number | undefined;
};

// gtag 함수 타입 선언
declare global {
	interface Window {
		gtag: (command: string, targetId: string | Date, config?: Record<string, unknown>) => void;
		dataLayer: unknown[];
	}
}

/**
 * GA 이벤트 전송
 */
export function sendGAEvent(event: GTagEvent) {
	if (typeof window === "undefined" || !window.gtag) {
		return;
	}

	const { action, category, label, value, ...params } = event;

	window.gtag("event", action, {
		event_category: category,
		event_label: label,
		value: value,
		...params,
	});
}

// ── 커스텀 이벤트 헬퍼 ──

export function trackChallengeCreateStart() {
	sendGAEvent({ action: "challenge_create_start", category: "challenge" });
}

export function trackChallengeCreateComplete(challengeId: string) {
	sendGAEvent({
		action: "challenge_create_complete",
		category: "challenge",
		challenge_id: challengeId,
	});
}

export function trackGameStart(challengeId: string) {
	sendGAEvent({
		action: "game_start",
		category: "game",
		challenge_id: challengeId,
	});
}

export function trackGameComplete(challengeId: string) {
	sendGAEvent({
		action: "game_complete",
		category: "game",
		challenge_id: challengeId,
	});
}

export function trackVoteSubmit(challengeId: string, difficulty: string) {
	sendGAEvent({
		action: "vote_submit",
		category: "engagement",
		challenge_id: challengeId,
		difficulty,
	});
}

export function trackShareClick(challengeId: string, method: string) {
	sendGAEvent({
		action: "share_click",
		category: "engagement",
		challenge_id: challengeId,
		share_method: method,
	});
}

/**
 * GA에 사용자 ID 설정
 */
export function setGAUserId(userId: string) {
	if (typeof window === "undefined" || !window.gtag) {
		return;
	}

	window.gtag("config", GA_ID, {
		user_id: userId,
	});
}
