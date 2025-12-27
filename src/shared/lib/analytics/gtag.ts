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
