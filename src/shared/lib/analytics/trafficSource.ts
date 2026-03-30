/**
 * Traffic Source Tracking
 *
 * GA4 Unassigned 트래픽을 줄이기 위해 세션 시작 시
 * UTM 파라미터, referrer, 인앱 브라우저 정보를 캡처하여 GA4로 전송합니다.
 * 세션당 1회만 전송됩니다.
 */

import { GA_ID, sendGAEvent } from "./gtag";

const SESSION_KEY = "ts_captured";

/** 한국 시장 중심 인앱 브라우저 UA 패턴 */
const IN_APP_BROWSERS: Record<string, RegExp> = {
	kakaotalk: /KAKAOTALK/i,
	naver: /NAVER\(|SamsungBrowser.*NAVER/i,
	line: /Line\//i,
	instagram: /Instagram/i,
	facebook: /FBAN|FBAV/i,
	band: /BAND\//i,
	tiktok: /BytedanceWebview|TikTok/i,
};

/**
 * User Agent에서 인앱 브라우저 감지
 */
export function detectInAppBrowser(): string | null {
	if (typeof navigator === "undefined") return null;
	const ua = navigator.userAgent;
	for (const [name, pattern] of Object.entries(IN_APP_BROWSERS)) {
		if (pattern.test(ua)) return name;
	}
	return null;
}

/**
 * 현재 URL에서 UTM 파라미터 추출
 */
function getUtmParams(): Record<string, string> {
	if (typeof window === "undefined") return {};
	const params = new URLSearchParams(window.location.search);
	const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
	const result: Record<string, string> = {};
	for (const key of utmKeys) {
		const value = params.get(key);
		if (value) result[key] = value;
	}
	return result;
}

/**
 * 외부 referrer 추출 (자체 도메인은 제외)
 */
function getExternalReferrer(): string {
	if (typeof document === "undefined") return "";
	const referrer = document.referrer;
	if (!referrer) return "(direct)";
	try {
		const refUrl = new URL(referrer);
		if (refUrl.hostname === window.location.hostname) return "(internal)";
		return refUrl.hostname;
	} catch {
		return referrer;
	}
}

/**
 * GA4 user property로 인앱 브라우저 설정
 */
function setInAppBrowserProperty(browser: string | null) {
	if (typeof window === "undefined" || !window.gtag) return;
	window.gtag("set", "user_properties", {
		in_app_browser: browser || "none",
	});
}

/**
 * 트래픽 소스 데이터를 캡처하여 GA4로 전송합니다.
 * sessionStorage로 세션당 1회만 실행됩니다.
 */
export function captureTrafficSource() {
	if (typeof window === "undefined") return;

	// 세션 내 중복 방지
	try {
		if (sessionStorage.getItem(SESSION_KEY)) return;
	} catch {
		// sessionStorage 사용 불가 시 (프라이빗 브라우징 등) 계속 진행
	}

	const utmParams = getUtmParams();
	const referrer = getExternalReferrer();
	const inAppBrowser = detectInAppBrowser();

	// 인앱 브라우저를 user property로 설정 (모든 이벤트에 자동 첨부)
	setInAppBrowserProperty(inAppBrowser);

	// 트래픽 소스 이벤트 전송 (ts_ 접두사로 GA4 예약어 충돌 방지)
	sendGAEvent({
		action: "traffic_source_captured",
		category: "acquisition",
		ts_source: utmParams.utm_source || "(not set)",
		ts_medium: utmParams.utm_medium || "(not set)",
		ts_campaign: utmParams.utm_campaign || "(not set)",
		ts_referrer: referrer,
		ts_in_app_browser: inAppBrowser || "none",
		ts_landing_page: window.location.pathname,
	});

	// 캡처 완료 표시
	try {
		sessionStorage.setItem(SESSION_KEY, "1");
	} catch {
		// ignore
	}
}
