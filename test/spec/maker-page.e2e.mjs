/**
 * E2E 검증 도구: 챌린지 만들기 페이지 (/maker)
 * 실행: node test/spec/maker-page.e2e.mjs [TC번호]
 * 스펙: test/spec/maker-page.md
 */

import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "fs";

const BASE = "http://localhost:3000";
const SHOT_DIR = "/tmp/e2e-maker";
const targetTC = process.argv[2] ? Number(process.argv[2]) : null;

mkdirSync(SHOT_DIR, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
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

async function clickByText(text) {
	await evaluate(`(() => { for (const el of document.querySelectorAll('button, a')) { if (el.textContent.trim().includes('${text}') && !el.disabled) { el.click(); return; } } })()`);
	await sleep(500);
}

async function printState(stepName) {
	const body = await evaluate(`document.body.innerText.substring(0, 500)`);
	const shotPath = await screenshot(stepName);
	console.log(`\n  [${stepName}]`);

	// 라운드 정보 추출
	const roundText = await evaluate(`(() => {
		for (const el of document.querySelectorAll('h2')) {
			if (el.textContent.includes('라운드') && el.textContent.includes('/')) return el.textContent.trim();
		}
		return '(없음)';
	})()`);
	console.log(`    라운드: "${roundText}"`);

	const slotCount = await evaluate(`document.querySelectorAll('[class*="aspect-square"], [class*="클릭하여"]').length`);
	console.log(`    스크린샷: ${shotPath}`);
}

function shouldRun(tc) { return targetTC === null || targetTC === tc; }

console.log("=== E2E (CDP): 챌린지 만들기 페이지 ===");

if (shouldRun(1)) {
	console.log("\n━━ TC-1: 페이지 로드 & 기본 렌더링 ━━");
	await navigate("/maker");
	const hasImageMgmt = await evaluate(`document.body.innerText.includes('이미지 관리')`);
	const hasRound = await evaluate(`document.body.innerText.includes('라운드 1 / 5')`);
	const hasGenerate = await evaluate(`document.body.innerText.includes('생성하기')`);
	console.log(`    "이미지 관리": ${hasImageMgmt}`);
	console.log(`    "라운드 1 / 5": ${hasRound}`);
	console.log(`    "생성하기": ${hasGenerate}`);
	await printState("tc1-load");
}

if (shouldRun(2)) {
	console.log("\n━━ TC-2: 라운드 수 변경 ━━");
	await navigate("/maker");

	// aria-label 기반 셀렉터
	const clickPlus = `document.querySelector('button[aria-label="라운드 수 늘리기"]')?.click()`;
	const clickMinus = `document.querySelector('button[aria-label="라운드 수 줄이기"]')?.click()`;

	// + 버튼 클릭 (5 → 6... 아니면 max=5이므로 변화 없을 수 있음)
	await evaluate(clickPlus);
	await sleep(300);
	await printState("tc2-plus");

	// - 버튼 3번 클릭
	for (let i = 0; i < 3; i++) {
		await evaluate(clickMinus);
		await sleep(200);
	}
	await printState("tc2-minus-3");

	// 1까지 줄이기
	for (let i = 0; i < 5; i++) {
		await evaluate(`(() => {
			const btn = document.querySelector('button[aria-label="라운드 수 줄이기"]');
			if (btn && !btn.disabled) btn.click();
		})()`);
		await sleep(200);
	}
	const minusDisabled = await evaluate(
		`document.querySelector('button[aria-label="라운드 수 줄이기"]')?.disabled ?? false`
	);
	console.log(`    최소(1)에서 - 비활성화: ${minusDisabled}`);
	await printState("tc2-min");
}

if (shouldRun(3)) {
	console.log("\n━━ TC-3: 라운드 네비게이션 ━━");
	await navigate("/maker");

	// 라운드 수를 3으로 설정 (5 → 3)
	const clickMinus = `document.querySelector('button[aria-label="라운드 수 줄이기"]')?.click()`;
	await evaluate(clickMinus);
	await sleep(200);
	await evaluate(clickMinus);
	await sleep(200);

	// Round 네비게이션: "Round X / Y" 텍스트 옆 버튼들
	// RoundControl: prev(ChevronLeft) + "Round X / Y" + next(ChevronRight)
	// next = 두 번째 버튼 in the round nav container
	const clickRoundNext = `(() => {
		const els = document.querySelectorAll('.chalk-text');
		for (const el of els) {
			if (el.textContent.includes('Round') && el.textContent.includes('/')) {
				const container = el.parentElement;
				const btns = container.querySelectorAll('button');
				const next = btns[btns.length - 1];
				if (next && !next.disabled) next.click();
				return;
			}
		}
	})()`;
	const clickRoundPrev = `(() => {
		const els = document.querySelectorAll('.chalk-text');
		for (const el of els) {
			if (el.textContent.includes('Round') && el.textContent.includes('/')) {
				const container = el.parentElement;
				const btns = container.querySelectorAll('button');
				if (btns[0] && !btns[0].disabled) btns[0].click();
				return;
			}
		}
	})()`;

	await evaluate(clickRoundNext);
	await sleep(300);
	await printState("tc3-next");

	// 다시 다음 (라운드 3/3이면 비활성화)
	await evaluate(clickRoundNext);
	await sleep(300);
	const nextDisabled = await evaluate(`(() => {
		const els = document.querySelectorAll('.chalk-text');
		for (const el of els) {
			if (el.textContent.includes('Round') && el.textContent.includes('/')) {
				const container = el.parentElement;
				const btns = container.querySelectorAll('button');
				return btns[btns.length - 1]?.disabled ?? false;
			}
		}
		return false;
	})()`);
	console.log(`    마지막 라운드에서 "다음" 비활성화: ${nextDisabled}`);
	await printState("tc3-last-round");

	// 이전
	await evaluate(clickRoundPrev);
	await sleep(300);
	await printState("tc3-prev");
}

if (shouldRun(4)) {
	console.log("\n━━ TC-4: 이름 표시 토글 ━━");
	await navigate("/maker");
	const hasToggle = await evaluate(`document.body.innerText.includes('이름 표시')`);
	console.log(`    "이름 표시" 토글: ${hasToggle}`);

	await evaluate(`(() => {
		const btn = document.querySelector('button[role="switch"]');
		if (btn) btn.click();
	})()`);
	await sleep(300);
	const toggleState = await evaluate(`document.querySelector('button[role="switch"]')?.getAttribute('aria-checked')`);
	console.log(`    토글 상태: ${toggleState}`);
	await printState("tc4-toggle");
}

await cdp.detach();
await browser.close();
console.log("\n━━ 완료 ━━");
console.log(`스크린샷 경로: ${SHOT_DIR}/`);
