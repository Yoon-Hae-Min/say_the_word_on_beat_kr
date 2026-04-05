/**
 * E2E 검증 도구: 게임 플레이 페이지 (/play/[id])
 * 실행: node test/spec/play-page.e2e.mjs [TC번호]
 * 스펙: test/spec/play-page.md
 *
 * 챌린지 ID는 /challenges 페이지에서 동적으로 가져온다.
 */

import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "fs";

const BASE = "http://localhost:3000";
const SHOT_DIR = "/tmp/e2e-play";
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
	await sleep(1000);
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
	await sleep(500);
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

// 챌린지 ID 가져오기
console.log("챌린지 ID 가져오는 중...");
await navigate("/challenges");
const challengeId = await evaluate(`(() => {
	const card = document.querySelector('.animate-fade-in');
	const target = card?.querySelector("[class*='cursor-pointer']") || card;
	if (!target) return null;
	// onClick에서 router.push로 이동하는 ID 추출 — 클릭 후 URL에서 가져오기
	return null;
})()`);

// 직접 클릭해서 ID 추출
await evaluate(`(() => {
	const card = document.querySelector('.animate-fade-in');
	const target = card?.querySelector("[class*='cursor-pointer']") || card;
	if (target) target.click();
})()`);
await sleep(2000);
const playUrl = await currentUrl();
const id = new URL(playUrl).pathname.replace("/play/", "");
console.log(`챌린지 ID: ${id}`);

console.log("\n=== E2E (CDP): 게임 플레이 페이지 ===");

if (shouldRun(1)) {
	console.log("\n━━ TC-1: 페이지 로드 & Idle 화면 ━━");
	await navigate(`/play/${id}`);

	const hasTitle = await evaluate(`!!document.querySelector('h1')`);
	const hasStart = await evaluate(`document.body.innerText.includes('시작하기')`);
	const hasSpeed = await evaluate(`document.body.innerText.includes('속도')`);
	const hasDifficulty = await evaluate(`document.body.innerText.includes('쉬움') || document.body.innerText.includes('보통') || document.body.innerText.includes('어려움')`);
	console.log(`    제목 존재: ${hasTitle}`);
	console.log(`    시작하기 버튼: ${hasStart}`);
	console.log(`    속도 버튼: ${hasSpeed}`);
	console.log(`    난이도 정보: ${hasDifficulty}`);
	await printState("tc1-idle");
}

if (shouldRun(2)) {
	console.log("\n━━ TC-2: 속도 선택 모달 ━━");
	await navigate(`/play/${id}`);

	await clickByText("속도");
	await sleep(500);
	const hasModal = await evaluate(`document.body.innerText.includes('속도 선택')`);
	const hasSlider = await evaluate(`!!document.querySelector('input[type="range"]')`);
	const hasConfirm = await evaluate(`(() => {
		const dialog = document.querySelector('[role="dialog"]');
		return dialog ? dialog.innerText.includes('확인') : false;
	})()`);
	console.log(`    "속도 선택" 모달: ${hasModal}`);
	console.log(`    슬라이더: ${hasSlider}`);
	console.log(`    확인 버튼: ${hasConfirm}`);
	await printState("tc2-speed-modal");

	// 확인 클릭으로 닫기
	await evaluate(`(() => {
		const dialog = document.querySelector('[role="dialog"]');
		if (dialog) {
			for (const btn of dialog.querySelectorAll('button')) {
				if (btn.textContent.includes('확인')) { btn.click(); return; }
			}
		}
	})()`);
	await sleep(500);
	const modalClosed = await evaluate(`!document.querySelector('[role="dialog"]')`);
	console.log(`    모달 닫힘: ${modalClosed}`);
	await printState("tc2-modal-closed");
}

if (shouldRun(3)) {
	console.log("\n━━ TC-3: 게임 시작 → 카운트다운 ━━");
	await navigate(`/play/${id}`);

	await clickByText("시작하기");
	await sleep(500);
	await printState("tc3-countdown-1");
	await sleep(1000);
	await printState("tc3-countdown-2");
	await sleep(1000);
	await printState("tc3-countdown-3");
}

if (shouldRun(4)) {
	console.log("\n━━ TC-4: 네비게이션 바 ━━");
	await navigate(`/play/${id}`);

	const hasListBtn = await evaluate(`document.body.innerText.includes('목록')`);
	console.log(`    "목록" 버튼: ${hasListBtn}`);
	await printState("tc4-nav");

	await clickByText("목록");
	await sleep(1000);
	await printState("tc4-navigate");
}

await cdp.detach();
await browser.close();
console.log("\n━━ 완료 ━━");
console.log(`스크린샷 경로: ${SHOT_DIR}/`);
