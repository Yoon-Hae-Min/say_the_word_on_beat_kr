---
name: e2e-test
description: >
  CDP 기반 E2E 블랙박스 테스트를 실행하고 검증하는 스킬.
  test/spec/ 폴더의 시나리오 스펙(.md)과 CDP 스크립트(.e2e.mjs)를 사용한다.
  스크립트는 각 단계의 스크린샷과 상태를 출력하고, 에이전트가 스펙과 대조하여 pass/fail을 판정한다.
  트리거: "E2E 테스트 돌려줘", "E2E 검증해줘", "테스트 실행해", "스펙 검증",
  "{페이지이름} 테스트", "전체 E2E", 기능 배포 전 검증이 필요할 때.
---

# E2E 블랙박스 테스트

## 구조

```
test/spec/
├── {page-name}.md           # 시나리오 스펙 (사람이 읽는 문서)
└── {page-name}.e2e.mjs      # CDP 스크립트 (에이전트가 실행하는 코드)
```

- **스펙 문서(.md)**: TC별 행동과 기대 결과를 자연어로 기술
- **CDP 스크립트(.e2e.mjs)**: 각 TC 단계를 CDP로 실행하고, 스크린샷 + 상태(URL, DOM 텍스트, 카드 수 등)를 출력. pass/fail 판정은 하지 않음

## 환경

E2E 테스트는 **로컬 Supabase** 환경에서 실행한다. prod DB를 사용하지 않는다.

### 로컬 Supabase 구성

| 항목 | 값 |
|------|-----|
| API URL | `http://127.0.0.1:54321` |
| Anon Key | `npx supabase status`로 확인 |
| Service Key | `npx supabase status`로 확인 |
| DB | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
| Studio | `http://127.0.0.1:54323` |
| 스키마 | `supabase/migrations/00000000000000_schema.sql` |
| 시드 데이터 | `supabase/seed.sql` (챌린지 15개) |

### 시작/중지

```bash
# 시작 (Docker 실행 필요)
npx supabase start

# DB 초기화 (스키마 + 시드 재적용)
npx supabase db reset

# 중지
npx supabase stop
```

### dev 서버 실행 시

로컬 Supabase 환경으로 dev 서버를 실행하는 스크립트:

```bash
./scripts/dev-local.sh
```

이 스크립트는:
1. `.env.local`을 백업 (`.env.local.bak`)
2. `.env.test.local`의 Supabase 값으로 교체
3. `pnpm dev` 실행
4. 종료(Ctrl+C) 시 `.env.local` 자동 복원

수동 설정이 필요한 경우 `.env.test.local` 참조 또는 `npx supabase status`로 키 확인.

## 실행 플로우

### 1. 전제 조건 확인

- 로컬 Supabase 실행 중: `npx supabase status`
- dev 서버 실행 중 (로컬 Supabase 연결):

```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000
```

200이 아니면 사용자에게 로컬 Supabase + `pnpm dev` 실행을 안내한다.

### 2. 스펙 읽기

`test/spec/{page-name}.md`를 읽어 어떤 TC가 있고, 각 TC의 기대 결과가 무엇인지 파악한다.

### 3. CDP 스크립트 실행

```bash
# 전체 TC 실행
node test/spec/{page-name}.e2e.mjs

# 개별 TC 실행
node test/spec/{page-name}.e2e.mjs {TC번호}
```

스크립트는 각 단계마다 다음을 출력한다:
- URL, 쿼리 파라미터
- h1 텍스트, 카드 수 등 DOM 상태
- 스크린샷 경로 (`/tmp/e2e-{page}/` 하위)

### 4. 스크린샷 확인

Read 도구로 스크린샷을 읽어 시각적으로 확인한다.
모든 스크린샷을 볼 필요는 없다 — 콘솔 출력으로 명확한 것은 스킵하고, 시각적 확인이 필요한 것만 읽는다.

### 5. 판정 및 보고

스펙 문서의 각 TC와 대조하여 pass/fail을 판정하고, 아래 형식으로 보고한다:

```
## E2E 테스트 결과: /{page-name}

| TC | 이름 | 결과 | 근거 |
|----|------|------|------|
| TC-1 | ... | ✅ | ... |
| TC-2 | ... | ❌ | ... (실패 원인) |

**총 결과: N/M TC 통과**
```

실패한 TC가 있으면:
1. 해당 스크린샷을 Read로 확인하여 시각적 원인 분석
2. 콘솔 출력과 스펙을 대조하여 어떤 기대 결과가 불일치하는지 특정
3. 원인과 수정 방향을 함께 보고

## 테스트 스펙 목록

| 페이지 | 스펙 | 스크립트 |
|--------|------|---------|
| / | test/spec/landing-page.md | test/spec/landing-page.e2e.mjs |
| /challenges | test/spec/challenges-page.md | test/spec/challenges-page.e2e.mjs |
| /maker | test/spec/maker-page.md | test/spec/maker-page.e2e.mjs |
| /my | test/spec/my-page.md | test/spec/my-page.e2e.mjs |
| /play/[id] | test/spec/play-page.md | test/spec/play-page.e2e.mjs |

## 새 테스트 추가 시

1. 사용자와 TC를 논의하여 시나리오를 정한다
2. `test/spec/{page-name}.md`에 시나리오 스펙을 작성한다
3. `test/spec/{page-name}.e2e.mjs`에 CDP 스크립트를 작성한다
   - `page.createCDPSession()`으로 CDP 세션 생성
   - `cdp.send("Page.navigate", ...)`, `cdp.send("Runtime.evaluate", ...)` 등 CDP 프로토콜 직접 사용
   - 각 단계에서 스크린샷 + 상태 출력
   - 자동 pass/fail 판정 없음
4. 실행하여 검증한다
