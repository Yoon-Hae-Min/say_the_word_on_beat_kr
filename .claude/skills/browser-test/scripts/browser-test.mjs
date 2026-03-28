#!/usr/bin/env node

/**
 * Browser Test Helper Script
 *
 * CDP를 통해 Chrome 브라우저에 접근하여 UI 검증을 수행하는 CLI 도구.
 * Puppeteer 기반으로 headless Chrome을 띄우고 스크린샷, DOM 검사,
 * 콘솔 에러 확인, 인터랙션 테스트를 수행한다.
 *
 * Usage:
 *   node browser-test.mjs --url http://localhost:3000 --screenshot /tmp/test.png --check-console
 */

import puppeteer from "puppeteer";

// --- Argument Parsing ---

const args = process.argv.slice(2);

function getArg(name) {
	const idx = args.indexOf(name);
	if (idx === -1) return null;
	return args[idx + 1] || null;
}

function hasFlag(name) {
	return args.includes(name);
}

const url = getArg("--url");
if (!url) {
	console.error("Error: --url is required");
	console.error(
		'Usage: node browser-test.mjs --url <url> [--screenshot <path>] [--check-console] [--wait-for <selector>] [--click <selector>] [--type "<selector>" "<text>"] [--eval <js>] [--viewport <WxH>] [--mobile] [--full-page] [--timeout <ms>]',
	);
	process.exit(1);
}

const screenshotPath = getArg("--screenshot");
const fullPage = hasFlag("--full-page");
const checkConsole = hasFlag("--check-console");
const waitForSelector = getArg("--wait-for");
const clickSelector = getArg("--click");
const typeSelector = getArg("--type");
const typeText = typeSelector ? args[args.indexOf("--type") + 2] : null;
const evalJs = getArg("--eval");
const viewportArg = getArg("--viewport");
const isMobile = hasFlag("--mobile");
const timeout = Number.parseInt(getArg("--timeout") || "10000", 10);

// --- Main ---

const results = {
	url,
	timestamp: new Date().toISOString(),
	viewport: null,
	screenshot: null,
	console: [],
	dom: {},
	interactions: [],
	eval: null,
	errors: [],
};

let browser;

try {
	// Launch browser
	browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
	});

	const page = await browser.newPage();

	// Set viewport
	if (isMobile) {
		await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
		results.viewport = "375x667 (mobile)";
	} else if (viewportArg) {
		const [w, h] = viewportArg.split("x").map(Number);
		await page.setViewport({ width: w, height: h });
		results.viewport = viewportArg;
	} else {
		await page.setViewport({ width: 1280, height: 720 });
		results.viewport = "1280x720";
	}

	// Collect console messages
	if (checkConsole) {
		page.on("console", (msg) => {
			results.console.push({
				type: msg.type(),
				text: msg.text(),
			});
		});

		page.on("pageerror", (err) => {
			results.errors.push({
				type: "page-error",
				message: err.message,
			});
		});
	}

	// Navigate
	console.log(`Navigating to ${url}...`);
	const response = await page.goto(url, {
		waitUntil: "networkidle0",
		timeout,
	});

	results.dom.status = response?.status() || null;
	results.dom.title = await page.title();

	// Wait for selector
	if (waitForSelector) {
		try {
			await page.waitForSelector(waitForSelector, { timeout });
			results.dom.waitForResult = { selector: waitForSelector, found: true };
		} catch {
			results.dom.waitForResult = { selector: waitForSelector, found: false };
		}
	}

	// Click
	if (clickSelector) {
		try {
			await page.click(clickSelector);
			results.interactions.push({ action: "click", selector: clickSelector, success: true });
			// Wait a bit for the click to take effect
			await new Promise((r) => setTimeout(r, 1000));
		} catch (err) {
			results.interactions.push({
				action: "click",
				selector: clickSelector,
				success: false,
				error: err.message,
			});
		}
	}

	// Type
	if (typeSelector && typeText) {
		try {
			await page.type(typeSelector, typeText);
			results.interactions.push({
				action: "type",
				selector: typeSelector,
				text: typeText,
				success: true,
			});
		} catch (err) {
			results.interactions.push({
				action: "type",
				selector: typeSelector,
				text: typeText,
				success: false,
				error: err.message,
			});
		}
	}

	// Eval
	if (evalJs) {
		try {
			const evalResult = await page.evaluate(evalJs);
			results.eval = { expression: evalJs, result: evalResult };
		} catch (err) {
			results.eval = { expression: evalJs, error: err.message };
		}
	}

	// Screenshot
	if (screenshotPath) {
		await page.screenshot({ path: screenshotPath, fullPage });
		results.screenshot = screenshotPath;
		console.log(`Screenshot saved to ${screenshotPath}`);
	}

	// Gather page info
	results.dom.url = page.url();
	results.dom.bodyText = await page.evaluate(
		() => document.body?.innerText?.substring(0, 500) || "",
	);

	// Print results
	console.log("\n--- Browser Test Results ---");
	console.log(JSON.stringify(results, null, 2));
} catch (err) {
	console.error("Browser test failed:", err.message);
	results.errors.push({ type: "script-error", message: err.message });
	console.log(JSON.stringify(results, null, 2));
	process.exit(1);
} finally {
	if (browser) {
		await browser.close();
	}
}
