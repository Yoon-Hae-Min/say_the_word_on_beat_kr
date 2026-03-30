import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { afterEach, describe, expect, it, vi } from "vitest";

dayjs.extend(isoWeek);

// Supabase 클라이언트 모킹 (환경변수 불필요하게)
vi.mock("@/shared/api/supabase/client", () => ({
	supabase: {},
}));

import { getTimeBoundCutoff } from "./repository";

describe("getTimeBoundCutoff", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	describe("views_week", () => {
		it("이번주 월요일 00:00을 반환한다", () => {
			// 2026-03-31 화요일로 고정
			vi.useFakeTimers({ now: new Date("2026-03-31T14:30:00") });

			const cutoff = getTimeBoundCutoff("views_week");

			expect(cutoff.format("YYYY-MM-DD")).toBe("2026-03-30"); // 월요일
			expect(cutoff.hour()).toBe(0);
			expect(cutoff.minute()).toBe(0);
		});

		it("월요일에 실행하면 오늘 00:00을 반환한다", () => {
			// 2026-03-30 월요일로 고정
			vi.useFakeTimers({ now: new Date("2026-03-30T10:00:00") });

			const cutoff = getTimeBoundCutoff("views_week");

			expect(cutoff.format("YYYY-MM-DD")).toBe("2026-03-30");
		});

		it("일요일에 실행하면 직전 월요일을 반환한다", () => {
			// 2026-03-29 일요일로 고정
			vi.useFakeTimers({ now: new Date("2026-03-29T10:00:00") });

			const cutoff = getTimeBoundCutoff("views_week");

			expect(cutoff.format("YYYY-MM-DD")).toBe("2026-03-23"); // 직전 월요일
		});
	});

	describe("views_month", () => {
		it("이번달 1일 00:00을 반환한다", () => {
			vi.useFakeTimers({ now: new Date("2026-03-31T14:30:00") });

			const cutoff = getTimeBoundCutoff("views_month");

			expect(cutoff.format("YYYY-MM-DD")).toBe("2026-03-01");
			expect(cutoff.hour()).toBe(0);
			expect(cutoff.minute()).toBe(0);
		});

		it("1일에 실행해도 올바르게 동작한다", () => {
			vi.useFakeTimers({ now: new Date("2026-04-01T00:00:00") });

			const cutoff = getTimeBoundCutoff("views_month");

			expect(cutoff.format("YYYY-MM-DD")).toBe("2026-04-01");
		});

		it("2월에도 날짜 오버플로우가 발생하지 않는다", () => {
			// 2월 28일 (비윤년)
			vi.useFakeTimers({ now: new Date("2026-02-28T10:00:00") });

			const cutoff = getTimeBoundCutoff("views_month");

			expect(cutoff.format("YYYY-MM-DD")).toBe("2026-02-01");
		});

		it("31일이 없는 달에서도 정확하게 동작한다", () => {
			// 4월 30일 (30일까지만 있는 달)
			vi.useFakeTimers({ now: new Date("2026-04-30T23:59:59") });

			const cutoff = getTimeBoundCutoff("views_month");

			expect(cutoff.format("YYYY-MM-DD")).toBe("2026-04-01");
		});
	});
});
