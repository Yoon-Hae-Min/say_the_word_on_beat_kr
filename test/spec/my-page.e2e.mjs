/**
 * E2E 검증 도구: 내 챌린지 페이지 (/my)
 * 실행: node test/spec/my-page.e2e.mjs [TC번호]
 * 스펙: test/spec/my-page.md
 */

import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "fs";

const BASE = "http://localhost:3000";
const SHOT_DIR = "/tmp/e2e-my";
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

async function printState(stepName) {
	const url = await currentUrl();
	const title = await evaluate(`document.querySelector('h1')?.textContent?.trim() ?? '(없음)'`);
	const body = await evaluate(`document.body.innerText.substring(0, 400)`);
	const shotPath = await screenshot(stepName);
	console.log(`\n  [${stepName}]`);
	console.log(`    URL: ${url}`);
	console.log(`    h1: "${title}"`);
	console.log(`    본문 일부: "${body.substring(0, 100)}..."`);
	console.log(`    스크린샷: ${shotPath}`);
}

function shouldRun(tc) { return targetTC === null || targetTC === tc; }

console.log("=== E2E (CDP): 내 챌린지 페이지 ===");

if (shouldRun(1)) {
	console.log("\n━━ TC-1: 페이지 로드 & 기본 렌더링 ━━");
	await navigate("/my");
	const hasTitle = await evaluate(`document.body.innerText.includes('내 챌린지')`);
	const hasBack = await evaluate(`document.body.innerText.includes('챌린지 목록')`);
	const hasDeviceLink = await evaluate(`document.body.innerText.includes('다른 기기 연결')`);
	console.log(`    "내 챌린지" 제목: ${hasTitle}`);
	console.log(`    뒤로가기 버튼: ${hasBack}`);
	console.log(`    기기 연결 버튼: ${hasDeviceLink}`);
	await printState("tc1-load");
}

if (shouldRun(2)) {
	console.log("\n━━ TC-2: 빈 상태 ━━");
	await navigate("/my");
	const hasEmpty = await evaluate(`document.body.innerText.includes('아직 만든 챌린지가 없어요') || document.body.innerText.includes('없어요')`);
	const hasCreateBtn = await evaluate(`document.body.innerText.includes('첫 챌린지 만들기')`);
	console.log(`    빈 상태 메시지: ${hasEmpty}`);
	console.log(`    만들기 버튼: ${hasCreateBtn}`);
	await printState("tc2-empty");
}

if (shouldRun(3)) {
	console.log("\n━━ TC-3: 네비게이션 ━━");
	await navigate("/my");
	await clickByText("챌린지 목록");
	await printState("tc3-back");
}

if (shouldRun(4)) {
	console.log("\n━━ TC-4: 다른 기기 연결 모달 ━━");
	await navigate("/my");
	await clickByText("다른 기기 연결");
	await sleep(500);
	const hasModal = await evaluate(`document.body.innerText.includes('보내기') || document.body.innerText.includes('가져오기')`);
	console.log(`    모달 열림 (보내기/가져오기): ${hasModal}`);
	await printState("tc4-device-modal");

	// 모달 닫기 (오버레이 클릭)
	await evaluate(`(() => {
		const overlay = document.querySelector('[aria-hidden="true"]');
		if (overlay) overlay.click();
	})()`);
	await sleep(500);
	const modalClosed = await evaluate(`!document.body.innerText.includes('보내기') || document.querySelector('[role="dialog"]') === null`);
	console.log(`    모달 닫힘: ${modalClosed}`);
	await printState("tc4-modal-closed");
}

await cdp.detach();
await browser.close();
console.log("\n━━ 완료 ━━");
console.log(`스크린샷 경로: ${SHOT_DIR}/`);
