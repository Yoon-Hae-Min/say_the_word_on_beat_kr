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

export function trackPlayPageView(challengeId: string) {
	sendGAEvent({ action: "play_page_view", category: "page", challenge_id: challengeId });
}

export function trackRoundComplete(challengeId: string, roundIndex: number) {
	sendGAEvent({
		action: "round_complete",
		category: "game",
		challenge_id: challengeId,
		round_index: roundIndex,
	});
}

export function trackGameReplay(challengeId: string) {
	sendGAEvent({ action: "game_replay", category: "game", challenge_id: challengeId });
}

export function trackMakerStepComplete(
	step: "resource_upload" | "round_config",
	resourceCount: number
) {
	sendGAEvent({
		action: "maker_step_complete",
		category: "challenge",
		step,
		resource_count: resourceCount,
	});
}

export function trackImageUploadFail(
	errorType: "compression" | "presigned_url" | "storage_upload"
) {
	sendGAEvent({ action: "image_upload_fail", category: "error", error_type: errorType });
}

export function trackChallengeCreateShare(
	challengeId: string,
	method: "copy_link" | "native_share"
) {
	sendGAEvent({
		action: "challenge_create_share",
		category: "engagement",
		challenge_id: challengeId,
		method,
	});
}

export function trackShareComplete(
	challengeId: string,
	method: "web_share_api" | "clipboard",
	context: "play_complete" | "create_success"
) {
	sendGAEvent({
		action: "share_complete",
		category: "engagement",
		challenge_id: challengeId,
		method,
		context,
	});
}

export function trackMyPageView(challengeCount: number) {
	sendGAEvent({ action: "my_page_view", category: "page", challenge_count: challengeCount });
}

export function trackBrowseOtherClick(challengeId: string) {
	sendGAEvent({
		action: "browse_other_click",
		category: "engagement",
		challenge_id: challengeId,
	});
}

export function trackDeviceLinkAction(actionType: "copy_code" | "import_code", success: boolean) {
	sendGAEvent({
		action: "device_link_action",
		category: "engagement",
		action_type: actionType,
		success: success ? 1 : 0,
	});
}

export function trackChallengeManageAction(
	actionType: "toggle_public" | "delete",
	challengeId: string
) {
	sendGAEvent({
		action: "challenge_manage_action",
		category: "engagement",
		action_type: actionType,
		challenge_id: challengeId,
	});
}

export function trackChallengeSearch(sortType: string, pageNumber: number) {
	sendGAEvent({
		action: "challenge_search",
		category: "engagement",
		sort_type: sortType,
		page_number: pageNumber,
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
