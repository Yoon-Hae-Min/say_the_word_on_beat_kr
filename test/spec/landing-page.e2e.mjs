/**
 * E2E 검증 도구: 랜딩 페이지 (/)
 * 실행: node test/spec/landing-page.e2e.mjs [TC번호]
 * 스펙: test/spec/landing-page.md
 */

import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "fs";

const BASE = "http://localhost:3000";
const SHOT_DIR = "/tmp/e2e-landing";
const targetTC = process.argv[2] ? Number(process.argv[2]) : null;

mkdirSync(SHOT_DIR, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });
const cdp = await page.createCDPSession();
await cdp.send("Page.enable");
await cdp.send("Runtime.enable");

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function navigate(path) {
	await cdp.send("Page.setLifecycleEventsEnabled", { enabled: true });
	await cdp.send("Page.navigate", { url: `${BASE}${path}` });
	await new Promise((resolve) => {
		const handler = (e) => { if (e.name === "networkIdle") { cdp.off("Page.lifecycleEvent", handler); resolve(); } };
		const timeout = setTimeout(() => { cdp.off("Page.lifecycleEvent", handler); resolve(); }, 10000);
		cdp.on("Page.lifecycleEvent", handler);
	});
	await sleep(500);
}

async function screenshot(name) {
	const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
	const p = `${SHOT_DIR}/${name}.png`;
	writeFileSync(p, Buffer.from(data, "base64"));
	return p;
}

async function evaluate(expr) {
	const { result } = await cdp.send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
	return result.value;
}

async function currentUrl() {
	const { currentIndex, entries } = await cdp.send("Page.getNavigationHistory");
	return entries[currentIndex].url;
}

async function clickByText(text) {
	await evaluate(`(() => { for (const el of document.querySelectorAll('button, a')) { if (el.textContent.trim().includes('${text}') && !el.disabled) { el.click(); return; } } })()`);
	await sleep(1000);
}

async function goBack() {
	const { currentIndex, entries } = await cdp.send("Page.getNavigationHistory");
	if (currentIndex > 0) await cdp.send("Page.navigateToHistoryEntry", { entryId: entries[currentIndex - 1].id });
	await sleep(1000);
}

async function printState(stepName) {
	const url = await currentUrl();
	const title = await evaluate(`document.querySelector('h1')?.textContent?.trim() ?? '(없음)'`);
	const body = await evaluate(`document.body.innerText.substring(0, 300)`);
	const shotPath = await screenshot(stepName);
	console.log(`\n  [${stepName}]`);
	console.log(`    URL: ${url}`);
	console.log(`    h1: "${title}"`);
	console.log(`    스크린샷: ${shotPath}`);
}

function shouldRun(tc) { return targetTC === null || targetTC === tc; }

console.log("=== E2E (CDP): 랜딩 페이지 ===");

if (shouldRun(1)) {
	console.log("\n━━ TC-1: 히어로 섹션 렌더링 ━━");
	await navigate("/");
	const hasTitle = await evaluate(`document.body.innerText.includes('단어리듬게임')`);
	const hasSubtitle = await evaluate(`document.body.innerText.includes('Say The Word On Beat')`);
	const hasCreateBtn = await evaluate(`document.body.innerText.includes('나만의 게임 만들기')`);
	const hasPlayBtn = await evaluate(`document.body.innerText.includes('인기 챌린지 플레이')`);
	console.log(`    제목 "단어리듬게임": ${hasTitle}`);
	console.log(`    부제목: ${hasSubtitle}`);
	console.log(`    만들기 버튼: ${hasCreateBtn}`);
	console.log(`    플레이 버튼: ${hasPlayBtn}`);
	await printState("tc1-hero");
}

if (shouldRun(2)) {
	console.log("\n━━ TC-2: CTA 버튼 동작 ━━");
	await navigate("/");

	await clickByText("인기 챌린지 플레이");
	await printState("tc2-play-click");

	await goBack();

	await clickByText("나만의 게임 만들기");
	await sleep(500);
	const modalVisible = await evaluate(`document.body.innerText.includes('시작하기') || document.body.innerText.includes('공개')`);
	console.log(`    모달 열림: ${modalVisible}`);
	await printState("tc2-create-modal");
}

if (shouldRun(3)) {
	console.log("\n━━ TC-3: 인기 챌린지 피드 ━━");
	await navigate("/");

	// 스크롤 다운하여 피드 섹션으로 이동
	await evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
	await sleep(500);

	const hasFeedTitle = await evaluate(`document.body.innerText.includes('인기 챌린지')`);
	const feedCards = await evaluate(`document.querySelectorAll('[data-section="feed"] .animate-fade-in, section .animate-fade-in').length`);
	const hasViewAll = await evaluate(`document.body.innerText.includes('모든 챌린지 보기')`);
	console.log(`    "인기 챌린지" 섹션: ${hasFeedTitle}`);
	console.log(`    피드 카드 수: ${feedCards}`);
	console.log(`    "모든 챌린지 보기" 링크: ${hasViewAll}`);
	await printState("tc3-feed");

	if (hasViewAll) {
		await clickByText("모든 챌린지 보기");
		await printState("tc3-view-all");
	}
}

if (shouldRun(4)) {
	console.log("\n━━ TC-4: 피드 챌린지 카드 클릭 ━━");
	await navigate("/");
	await evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
	await sleep(1000);

	// 피드 섹션의 카드 클릭 — 모든 클릭 가능 요소 시도
	await evaluate(`(() => {
		const section = document.querySelector('[data-section="feed"]');
		if (!section) return;
		const clickable = section.querySelector("[class*='cursor-pointer']")
			|| section.querySelector('.animate-fade-in');
		if (clickable) clickable.click();
	})()`);

	// SPA 네비게이션 대기
	const start = Date.now();
	while (Date.now() - start < 5000) {
		const url = await currentUrl();
		if (new URL(url).pathname.includes('/play/')) break;
		await sleep(300);
	}
	await printState("tc4-card-click");
}

await cdp.detach();
await browser.close();
console.log("\n━━ 완료 ━━");
console.log(`스크린샷 경로: ${SHOT_DIR}/`);
