---
name: browser-test
description: >
  CDP(Chrome DevTools Protocol)를 통해 브라우저에 직접 접근하여 UI를 검증하는 스킬.
  Puppeteer로 Chrome을 띄우고 스크린샷, DOM 검사, 콘솔 에러 확인, 클릭/입력 인터랙션을 수행합니다.
  트리거: "화면 확인해줘", "브라우저로 테스트해봐", "UI 테스트", "스크린샷 찍어줘",
  "화면이 제대로 나오는지 봐줘", "DOM 확인", "콘솔 에러 확인", "클릭 테스트",
  UI 구현 후 시각적 검증이 필요할 때, 코드 변경 후 결과를 눈으로 확인하고 싶을 때.
  이 스킬은 개발 서버(localhost:3000)가 실행 중이어야 합니다.
---

# Browser Test (CDP)

Puppeteer를 통해 Chrome을 headless로 띄우고, 개발 서버의 페이지를 직접 방문하여 시각적/기능적 검증을 수행한다.

## 전제 조건

1. **개발 서버가 실행 중**이어야 한다 (`pnpm dev` → localhost:3000)
2. **Puppeteer가 프로젝트에 설치**되어 있어야 한다

### 최초 설정

Puppeteer가 설치되어 있지 않으면 먼저 설치한다:

```bash
pnpm add -D puppeteer
```

## 검증 플로우

### 1단계: 무엇을 검증할지 결정

사용자의 요청에서 검증 대상을 파악한다:

| 검증 유형 | 예시 |
|-----------|------|
| **시각적 확인** | "화면이 제대로 나와?", "레이아웃 확인해줘" |
| **DOM 존재 확인** | "버튼이 있는지 봐줘", "텍스트가 보이는지" |
| **콘솔 에러** | "에러 없는지 확인", "콘솔 깨끗한지" |
| **인터랙션** | "클릭하면 어떻게 되는지", "입력이 되는지" |
| **네비게이션** | "페이지 이동 잘 되는지" |

### 2단계: 스크립트 작성 및 실행

`scripts/browser-test.mjs` 헬퍼 스크립트를 사용하거나, 직접 Node.js 스크립트를 작성한다.

#### 기본 사용법 — 헬퍼 스크립트

```bash
node .claude/skills/browser-test/scripts/browser-test.mjs \
  --url "http://localhost:3000" \
  --screenshot "/tmp/screenshot.png" \
  --check-console \
  --wait-for "text=시작하기"
```

#### 옵션

| 옵션 | 설명 |
|------|------|
| `--url <url>` | 방문할 URL (필수) |
| `--screenshot <path>` | 스크린샷 저장 경로 |
| `--full-page` | 전체 페이지 스크린샷 |
| `--check-console` | 콘솔 에러/경고 수집 |
| `--wait-for <selector>` | 특정 요소가 나타날 때까지 대기 |
| `--click <selector>` | 요소 클릭 |
| `--type <selector> <text>` | 요소에 텍스트 입력 |
| `--eval <js>` | 페이지에서 JS 실행 |
| `--viewport <width>x<height>` | 뷰포트 크기 (기본: 1280x720) |
| `--mobile` | 모바일 뷰포트 (375x667, touch 활성) |
| `--timeout <ms>` | 대기 타임아웃 (기본: 10000) |

#### 인라인 스크립트 — 복잡한 시나리오

헬퍼로 부족한 경우, 직접 Puppeteer 스크립트를 작성한다:

```javascript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });

// 콘솔 메시지 수집
const consoleLogs = [];
page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));

// 페이지 방문
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

// 스크린샷
await page.screenshot({ path: '/tmp/test.png', fullPage: true });

// DOM 검사
const title = await page.$eval('h1', el => el.textContent);
console.log('Title:', title);

// 클릭 인터랙션
await page.click('button:has-text("시작하기")');
await page.waitForSelector('.game-stage', { timeout: 5000 });

// 결과 출력
console.log('Console errors:', consoleLogs.filter(l => l.type === 'error'));

await browser.close();
```

### 3단계: 결과 확인

1. **스크린샷**: Read 도구로 이미지를 읽어 시각적으로 확인한다
2. **콘솔 출력**: 에러/경고 메시지를 분석한다
3. **DOM 결과**: 예상 요소가 존재하는지 확인한다

### 4단계: 사용자에게 보고

검증 결과를 정리하여 보고한다:

```
## 브라우저 테스트 결과

**URL**: http://localhost:3000/play/abc-123
**뷰포트**: 1280x720

### 스크린샷
[이미지 확인 결과 요약]

### DOM 검증
- ✅ "시작하기" 버튼 존재
- ✅ 챌린지 제목 표시
- ❌ 난이도 뱃지 누락

### 콘솔
- ⚠️ Warning: ...
- ❌ Error: ...

### 인터랙션
- ✅ 시작 버튼 클릭 → 카운트다운 시작
```

## 주요 페이지 경로

| 페이지 | URL | 주요 검증 포인트 |
|--------|-----|-----------------|
| 랜딩 | `/` | 히어로 섹션, 피드, CTA 버튼 |
| 챌린지 목록 | `/challenges` | 카드 그리드, 정렬, 페이지네이션 |
| 챌린지 생성 | `/maker` | 이미지 업로드, 슬롯 배치, 제출 |
| 게임 플레이 | `/play/[id]` | 비트 동기화, 라운드 전환, 완료 화면 |

## 자주 쓰는 셀렉터

```
// 칠판 테마 컴포넌트
.chalk-text          // 손글씨 폰트 텍스트
[data-slot="badge"]  // Badge 컴포넌트

// 게임 관련
button               // ChalkButton (시작하기 등)
h1.chalk-text        // 챌린지 제목
```

## 주의사항

- **개발 서버 확인**: 테스트 전 `localhost:3000`이 응답하는지 먼저 curl로 확인
- **환경변수**: Supabase 환경변수가 없으면 일부 페이지(play)가 동작하지 않을 수 있음
- **타임아웃**: 첫 로드가 느릴 수 있으므로 `waitUntil: 'networkidle0'`과 충분한 타임아웃 사용
- **스크린샷 경로**: `/tmp/` 아래에 저장하여 Read 도구로 확인
- **headless 모드**: 기본적으로 headless로 실행. 디버깅이 필요하면 `headless: false`
