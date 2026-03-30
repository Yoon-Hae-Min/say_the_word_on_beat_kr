import { describe, expect, it } from "vitest";
import { appendUtmParams, getShareUrl } from "./shareUtils";

describe("appendUtmParams", () => {
	it("URL에 UTM 파라미터를 추가한다", () => {
		const result = appendUtmParams("https://example.com/play/123", {
			source: "share",
			medium: "social",
			campaign: "challenge_complete",
		});

		const url = new URL(result);
		expect(url.searchParams.get("utm_source")).toBe("share");
		expect(url.searchParams.get("utm_medium")).toBe("social");
		expect(url.searchParams.get("utm_campaign")).toBe("challenge_complete");
	});

	it("기존 UTM 파라미터를 덮어쓴다", () => {
		const result = appendUtmParams(
			"https://example.com?utm_source=old&utm_medium=old&utm_campaign=old",
			{ source: "new", medium: "new_medium", campaign: "new_campaign" }
		);

		const url = new URL(result);
		expect(url.searchParams.get("utm_source")).toBe("new");
		expect(url.searchParams.get("utm_medium")).toBe("new_medium");
		expect(url.searchParams.get("utm_campaign")).toBe("new_campaign");
	});

	it("기존 non-UTM 쿼리 파라미터는 유지한다", () => {
		const result = appendUtmParams("https://example.com?page=1&sort=views", {
			source: "share",
			medium: "social",
			campaign: "test",
		});

		const url = new URL(result);
		expect(url.searchParams.get("page")).toBe("1");
		expect(url.searchParams.get("sort")).toBe("views");
		expect(url.searchParams.get("utm_source")).toBe("share");
	});

	it("UTM 파라미터 중복이 발생하지 않는다", () => {
		const first = appendUtmParams("https://example.com", {
			source: "a",
			medium: "b",
			campaign: "c",
		});
		const second = appendUtmParams(first, {
			source: "x",
			medium: "y",
			campaign: "z",
		});

		const url = new URL(second);
		expect(url.searchParams.getAll("utm_source")).toEqual(["x"]);
		expect(url.searchParams.getAll("utm_medium")).toEqual(["y"]);
		expect(url.searchParams.getAll("utm_campaign")).toEqual(["z"]);
	});
});

describe("getShareUrl", () => {
	const baseUrl = "https://example.com/play/abc-123";
	const text = "테스트 챌린지";

	/** 소셜 공유 URL에서 인코딩된 내부 URL을 디코딩하여 UTM 확인 */
	function extractInnerUrl(shareUrl: string): URL {
		const outerUrl = new URL(shareUrl);
		const encoded = outerUrl.searchParams.get("url") || outerUrl.searchParams.get("u") || "";
		return new URL(decodeURIComponent(encoded));
	}

	it("Twitter 공유 URL을 올바르게 생성한다", () => {
		const result = getShareUrl("twitter", baseUrl, text);
		const innerUrl = extractInnerUrl(result);

		expect(result).toContain("https://twitter.com/intent/tweet");
		expect(innerUrl.searchParams.get("utm_source")).toBe("twitter");
		expect(innerUrl.searchParams.get("utm_medium")).toBe("social");
		expect(innerUrl.searchParams.get("utm_campaign")).toBe("challenge_share");
	});

	it("Facebook 공유 URL을 올바르게 생성한다", () => {
		const result = getShareUrl("facebook", baseUrl);
		const innerUrl = extractInnerUrl(result);

		expect(result).toContain("https://www.facebook.com/sharer/sharer.php");
		expect(innerUrl.searchParams.get("utm_source")).toBe("facebook");
	});

	it("LINE 공유 URL을 올바르게 생성한다", () => {
		const result = getShareUrl("line", baseUrl);
		const innerUrl = extractInnerUrl(result);

		expect(result).toContain("https://social-plugins.line.me/lineit/share");
		expect(innerUrl.searchParams.get("utm_source")).toBe("line");
	});

	it("모든 플랫폼 URL에 UTM 파라미터가 포함된다", () => {
		const platforms = ["twitter", "facebook", "line"] as const;

		for (const platform of platforms) {
			const result = getShareUrl(platform, baseUrl);
			const innerUrl = extractInnerUrl(result);
			expect(innerUrl.searchParams.get("utm_source")).toBe(platform);
			expect(innerUrl.searchParams.get("utm_medium")).toBe("social");
			expect(innerUrl.searchParams.get("utm_campaign")).toBe("challenge_share");
		}
	});
});
