/**
 * E2E 검증 도구: 챌린지 리스트 페이지 (/challenges)
 * CDP(Chrome DevTools Protocol) 직접 사용
 *
 * 실행: node test/spec/challenges-page.e2e.mjs [TC번호]
 * 전제: localhost:3000 dev 서버 실행 중
 * 스펙: test/spec/challenges-page.md
 */

import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "fs";

const BASE = "http://localhost:3000";
const SHOT_DIR = "/tmp/e2e-challenges";
const targetTC = process.argv[2] ? Number(process.argv[2]) : null;

mkdirSync(SHOT_DIR, { recursive: true });

// 브라우저 연결 (Puppeteer는 브라우저 프로세스 관리용으로만 사용)
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });

// CDP 세션
const cdp = await page.createCDPSession();
await cdp.send("Page.enable");
await cdp.send("Runtime.enable");
await cdp.send("DOM.enable");

// --- CDP 유틸 ---

async function navigate(path) {
	await cdp.send("Page.navigate", { url: `${BASE}${path}` });
	await cdp.send("Page.setLifecycleEventsEnabled", { enabled: true });
	await new Promise((resolve) => {
		const handler = (event) => {
			if (event.name === "networkIdle") {
				cdp.off("Page.lifecycleEvent", handler);
				resolve();
			}
		};
		cdp.on("Page.lifecycleEvent", handler);
	});
	await sleep(500);
}

async function screenshot(name) {
	const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
	const path = `${SHOT_DIR}/${name}.png`;
	writeFileSync(path, Buffer.from(data, "base64"));
	return path;
}

async function evaluate(expression) {
	const { result } = await cdp.send("Runtime.evaluate", {
		expression,
		returnByValue: true,
		awaitPromise: true,
	});
	return result.value;
}

async function currentUrl() {
	const { currentIndex, entries } = await cdp.send("Page.getNavigationHistory");
	return entries[currentIndex].url;
}

function parseUrl(url) {
	const u = new URL(url);
	return {
		pathname: u.pathname,
		params: Object.fromEntries(u.searchParams),
	};
}

async function clickByText(text) {
	await evaluate(`
		(() => {
			for (const el of document.querySelectorAll('button, a')) {
				if (el.textContent.trim().includes('${text}') && !el.disabled) {
					el.click();
					return true;
				}
			}
			return false;
		})()
	`);
	await waitForNetworkIdle();
	await sleep(500);
}

async function selectOption(optionText) {
	// Select trigger 클릭
	await evaluate(`document.querySelector("button[data-slot='select-trigger']").click()`);
	await sleep(300);

	// 옵션 선택
	await evaluate(`
		(() => {
			for (const item of document.querySelectorAll("[data-slot='select-item']")) {
				if (item.textContent.trim() === '${optionText}') {
					item.click();
					return true;
				}
			}
			return false;
		})()
	`);
	await waitForNetworkIdle();
	await sleep(500);
}

async function goBack() {
	const { currentIndex, entries } = await cdp.send("Page.getNavigationHistory");
	if (currentIndex > 0) {
		await cdp.send("Page.navigateToHistoryEntry", { entryId: entries[currentIndex - 1].id });
		await waitForNetworkIdle();
		await sleep(500);
	}
}

async function waitForNetworkIdle() {
	// 간단한 네트워크 안정 대기
	await new Promise((resolve) => {
		let timer;
		const handler = () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				resolve();
			}, 1000);
		};
		handler();
		const onEvent = () => handler();
		cdp.on("Page.lifecycleEvent", onEvent);
		setTimeout(() => {
			cdp.off("Page.lifecycleEvent", onEvent);
			resolve();
		}, 5000);
	});
}

async function waitForPathname(expected, timeout = 5000) {
	const start = Date.now();
	while (Date.now() - start < timeout) {
		const url = await currentUrl();
		if (new URL(url).pathname.includes(expected)) return;
		await sleep(200);
	}
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

// --- 상태 출력 ---

async function printState(stepName) {
	console.log(`\n  [${stepName}]`);

	const url = await currentUrl();
	const { pathname, params } = parseUrl(url);
	const title = await evaluate(`document.querySelector('h1')?.textContent?.trim() ?? '(없음)'`);
	const cards = await evaluate(`document.querySelectorAll('.animate-fade-in').length`);
	const shotPath = await screenshot(stepName);

	console.log(`    URL: ${url}`);
	console.log(`    params: ${JSON.stringify(params)}`);
	console.log(`    h1: "${title}"`);
	console.log(`    카드 수: ${cards}`);
	console.log(`    스크린샷: ${shotPath}`);
}

function shouldRun(tc) {
	return targetTC === null || targetTC === tc;
}

// ─────────────────────────────────────
console.log("=== E2E (CDP): 챌린지 리스트 페이지 ===");

// TC-1
if (shouldRun(1)) {
	console.log("\n━━ TC-1: 페이지 로드 & 기본 렌더링 ━━");
	await navigate("/challenges");
	await printState("tc1-load");
}

// TC-2
if (shouldRun(2)) {
	console.log("\n━━ TC-2: 헤더 네비게이션 ━━");
	await navigate("/challenges");

	await clickByText("홈으로");
	await waitForPathname("/");
	await printState("tc2-home");

	await goBack();

	await clickByText("만들기");
	await waitForPathname("/maker");
	await printState("tc2-maker");

	await goBack();

	await clickByText("내 챌린지");
	await waitForPathname("/my");
	await printState("tc2-my");
}

// TC-3
if (shouldRun(3)) {
	console.log("\n━━ TC-3: 챌린지 카드 클릭 ━━");
	await navigate("/challenges");

	await evaluate(`
		(() => {
			const card = document.querySelector('.animate-fade-in');
			const target = card?.querySelector("[class*='cursor-pointer']") || card;
			if (target) target.click();
		})()
	`);
	await waitForPathname("/play/");
	await printState("tc3-card-click");
}

// TC-4
if (shouldRun(4)) {
	console.log("\n━━ TC-4: 정렬 — 전체 옵션 순회 ━━");
	await navigate("/challenges");

	for (const label of ["조회순", "이번주 인기", "이번달 인기", "최신순", "추천순"]) {
		await selectOption(label);
		await printState(`tc4-sort-${label}`);
	}
}

// TC-5
if (shouldRun(5)) {
	console.log("\n━━ TC-5: 페이지네이션 ━━");
	await navigate("/challenges");

	await clickByText("다음");
	await printState("tc5-next");

	await clickByText("이전");
	await printState("tc5-prev");

	await evaluate(`
		(() => {
			const btn = [...document.querySelectorAll('button')]
				.find(b => b.textContent.trim() === '3' && b.getAttribute('aria-label')?.includes('페이지'));
			if (btn) btn.click();
		})()
	`);
	await sleep(1000);
	await printState("tc5-page3");
}

// TC-6
if (shouldRun(6)) {
	console.log("\n━━ TC-6: 정렬 변경 시 page 리셋 ━━");
	await navigate("/challenges");

	await clickByText("다음");
	await printState("tc6-goto-page2");

	await selectOption("최신순");
	await printState("tc6-sort-change");
}

await cdp.detach();
await browser.close();
console.log("\n━━ 완료 ━━");
console.log(`스크린샷 경로: ${SHOT_DIR}/`);
