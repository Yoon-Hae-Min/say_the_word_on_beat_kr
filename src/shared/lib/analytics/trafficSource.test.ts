import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { captureTrafficSource, detectInAppBrowser } from "./trafficSource";

// sendGAEvent를 모킹
vi.mock("./gtag", () => ({
	GA_ID: "G-TEST",
	sendGAEvent: vi.fn(),
}));

import { sendGAEvent } from "./gtag";

describe("detectInAppBrowser", () => {
	const originalNavigator = globalThis.navigator;

	afterEach(() => {
		Object.defineProperty(globalThis, "navigator", {
			value: originalNavigator,
			configurable: true,
		});
	});

	function setUserAgent(ua: string) {
		Object.defineProperty(globalThis, "navigator", {
			value: { userAgent: ua },
			configurable: true,
		});
	}

	it("카카오톡 인앱 브라우저를 감지한다", () => {
		setUserAgent("Mozilla/5.0 KAKAOTALK 10.0.0");
		expect(detectInAppBrowser()).toBe("kakaotalk");
	});

	it("네이버 인앱 브라우저를 감지한다", () => {
		setUserAgent("Mozilla/5.0 NAVER(inapp; search)");
		expect(detectInAppBrowser()).toBe("naver");
	});

	it("LINE 인앱 브라우저를 감지한다", () => {
		setUserAgent("Mozilla/5.0 Line/13.0.0");
		expect(detectInAppBrowser()).toBe("line");
	});

	it("Instagram 인앱 브라우저를 감지한다", () => {
		setUserAgent("Mozilla/5.0 Instagram 300.0");
		expect(detectInAppBrowser()).toBe("instagram");
	});

	it("Facebook 인앱 브라우저를 감지한다 (FBAN)", () => {
		setUserAgent("Mozilla/5.0 FBAN/FB4A");
		expect(detectInAppBrowser()).toBe("facebook");
	});

	it("Facebook 인앱 브라우저를 감지한다 (FBAV)", () => {
		setUserAgent("Mozilla/5.0 FBAV/400.0");
		expect(detectInAppBrowser()).toBe("facebook");
	});

	it("BAND 인앱 브라우저를 감지한다", () => {
		setUserAgent("Mozilla/5.0 BAND/10.0.0");
		expect(detectInAppBrowser()).toBe("band");
	});

	it("TikTok 인앱 브라우저를 감지한다", () => {
		setUserAgent("Mozilla/5.0 BytedanceWebview");
		expect(detectInAppBrowser()).toBe("tiktok");
	});

	it("일반 브라우저는 null을 반환한다", () => {
		setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0");
		expect(detectInAppBrowser()).toBeNull();
	});

	it("navigator가 없으면 null을 반환한다", () => {
		Object.defineProperty(globalThis, "navigator", {
			value: undefined,
			configurable: true,
		});
		expect(detectInAppBrowser()).toBeNull();
	});
});

describe("captureTrafficSource", () => {
	const mockSessionStorage = new Map<string, string>();

	beforeEach(() => {
		vi.clearAllMocks();
		mockSessionStorage.clear();

		// window, document, sessionStorage 모킹
		Object.defineProperty(globalThis, "window", {
			value: {
				location: {
					search: "?utm_source=test&utm_medium=social&utm_campaign=launch",
					hostname: "example.com",
					pathname: "/challenges",
				},
				gtag: vi.fn(),
			},
			configurable: true,
		});

		Object.defineProperty(globalThis, "document", {
			value: { referrer: "https://google.com/search?q=test" },
			configurable: true,
		});

		Object.defineProperty(globalThis, "sessionStorage", {
			value: {
				getItem: (key: string) => mockSessionStorage.get(key) ?? null,
				setItem: (key: string, value: string) => mockSessionStorage.set(key, value),
			},
			configurable: true,
		});

		Object.defineProperty(globalThis, "navigator", {
			value: { userAgent: "Mozilla/5.0 Chrome/120.0" },
			configurable: true,
		});
	});

	it("UTM 파라미터와 referrer를 GA4 이벤트로 전송한다", () => {
		captureTrafficSource();

		expect(sendGAEvent).toHaveBeenCalledWith({
			action: "traffic_source_captured",
			category: "acquisition",
			ts_source: "test",
			ts_medium: "social",
			ts_campaign: "launch",
			ts_referrer: "google.com",
			ts_in_app_browser: "none",
			ts_landing_page: "/challenges",
		});
	});

	it("세션당 1회만 실행된다", () => {
		captureTrafficSource();
		captureTrafficSource();

		expect(sendGAEvent).toHaveBeenCalledTimes(1);
	});

	it("UTM 파라미터가 없으면 (not set)으로 전송한다", () => {
		Object.defineProperty(globalThis, "window", {
			value: {
				location: { search: "", hostname: "example.com", pathname: "/" },
				gtag: vi.fn(),
			},
			configurable: true,
		});

		captureTrafficSource();

		expect(sendGAEvent).toHaveBeenCalledWith(
			expect.objectContaining({
				ts_source: "(not set)",
				ts_medium: "(not set)",
				ts_campaign: "(not set)",
			})
		);
	});

	it("referrer가 없으면 (direct)로 전송한다", () => {
		Object.defineProperty(globalThis, "document", {
			value: { referrer: "" },
			configurable: true,
		});

		captureTrafficSource();

		expect(sendGAEvent).toHaveBeenCalledWith(expect.objectContaining({ ts_referrer: "(direct)" }));
	});

	it("같은 도메인의 referrer는 (internal)로 전송한다", () => {
		Object.defineProperty(globalThis, "document", {
			value: { referrer: "https://example.com/other-page" },
			configurable: true,
		});

		captureTrafficSource();

		expect(sendGAEvent).toHaveBeenCalledWith(
			expect.objectContaining({ ts_referrer: "(internal)" })
		);
	});
});
