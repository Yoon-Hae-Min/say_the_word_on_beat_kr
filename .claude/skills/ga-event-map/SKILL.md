---
name: ga-event-map
description: GA4 이벤트와 앱 기능 간의 매핑 레퍼런스. 새 기능 개발, 분석 설계, 이벤트 추가/수정 시 현재 트래킹 현황을 파악하는 데 사용한다.
---

# GA4 이벤트 매핑

이 프로젝트의 모든 GA4 이벤트와 앱 기능 간의 관계를 정의한다.
새 기능 개발 시 어떤 이벤트를 추가해야 하는지, 기존 이벤트와 중복되지 않는지 확인하는 용도로 사용한다.

## 사용 시점

- 새 기능에 GA 이벤트를 추가할 때 → 기존 이벤트와의 중복/충돌 확인
- GA4 대시보드에서 이벤트 의미를 파악할 때 → 어떤 사용자 행동이 발생한 것인지 역추적
- 퍼널 분석을 설계할 때 → 전환 경로상 이벤트 흐름 확인
- 이벤트 파라미터를 수정할 때 → 영향받는 파일과 컴포넌트 확인

## 인프라

| 항목 | 값 |
|------|-----|
| GA ID | `G-XR0CC6JPB7` |
| 이벤트 모듈 | `src/shared/lib/analytics/gtag.ts` |
| 트래픽 소스 | `src/shared/lib/analytics/trafficSource.ts` |
| 초기화 | `src/shared/components/GoogleAnalytics.tsx` |
| 기본 함수 | `sendGAEvent({ action, category, ...params })` |

---

## 이벤트 카탈로그

### 1. 랜딩 페이지 (Landing)

| 이벤트 | 카테고리 | 트리거 | 파일 | 파라미터 |
|--------|----------|--------|------|----------|
| `hero_cta_click` | `landing` | 히어로 CTA 버튼 클릭 | `widgets/landing-hero/ui/HeroSection.tsx` | `label`: `"create"` \| `"play"` |
| `section_view` | `landing_scroll` | 섹션이 뷰포트에 진입 (IntersectionObserver) | `widgets/landing-hero/hooks/useScrollTracking.ts` | `label`: 섹션 ID |
| `challenge_card_click` | `landing_feed` | 피드 챌린지 카드 클릭 | `widgets/landing-feed/ui/FeedSection.tsx` | `label`: 챌린지 제목 |
| `view_all_click` | `landing_feed` | "전체 보기" 버튼 클릭 | `widgets/landing-feed/ui/FeedSection.tsx` | - |
| `bottom_cta_click` | `landing` | 하단 CTA 배너 클릭 | `widgets/cta-banner/ui/CtaBanner.tsx` | `label`: `"create"` |

### 2. 챌린지 생성 (Challenge Creation)

| 이벤트 | 카테고리 | 트리거 | 파일 | 파라미터 |
|--------|----------|--------|------|----------|
| `challenge_create_start` | `challenge` | 생성 모달에서 "시작하기" 클릭 | `features/challenge-start/ui/StartModal.tsx` | - |
| `maker_step_complete` | `challenge` | 리소스 업로드 완료 | `features/challenge-creation/hooks/useChallengeForm.ts` | `step`: `"resource_upload"`, `resource_count` |
| `maker_step_complete` | `challenge` | 챌린지 제출 | `features/challenge-creation/hooks/useChallengeSubmission.ts` | `step`: `"round_config"`, `resource_count` |
| `create_challenge` | `challenge` | 챌린지 생성 API 성공 | `features/challenge-creation/api/challengeService.ts` | `label`: `"public"` \| `"private"` |
| `challenge_create_complete` | `challenge` | 성공 화면 마운트 | `features/challenge-creation/ui/SuccessScreen.tsx` | `challenge_id` |
| `challenge_create_share` | `engagement` | 생성 후 링크 복사 | `features/challenge-creation/ui/SuccessScreen.tsx` | `challenge_id`, `method`: `"copy_link"` |

### 3. 게임 플레이 (Game Play)

| 이벤트 | 카테고리 | 트리거 | 파일 | 파라미터 |
|--------|----------|--------|------|----------|
| `play_page_view` | `page` | 플레이 페이지 로드 | `app/play/[id]/page.tsx` | `challenge_id` |
| `speed_select` | `game` | 배속 선택 | `features/game-play/ui/GameStage.tsx` | `challenge_id`, `speed` |
| `game_start` | `game` | 게임 시작 버튼 클릭 | `features/game-play/ui/GameStage.tsx` | `challenge_id` |
| `round_complete` | `game` | 라운드 완료 (비트 감지) | `features/game-play/hooks/useGameBeatController.ts` | `challenge_id`, `round_index` |
| `game_complete` | `game` | 모든 라운드 완료 | `features/game-play/ui/GameStage.tsx` | `challenge_id` |
| `game_replay` | `game` | 다시하기 클릭 | `features/game-play/ui/FinishedGameScreen.tsx` | `challenge_id` |

### 4. 게임 완료 후 행동 (Post-Game)

| 이벤트 | 카테고리 | 트리거 | 파일 | 파라미터 |
|--------|----------|--------|------|----------|
| `share_click` | `engagement` | 공유 버튼 클릭 | `features/game-play/ui/FinishedGameScreen.tsx` | `challenge_id`, `share_method`: `"native_share"` |
| `share_complete` | `engagement` | 공유 성공 | `FinishedGameScreen.tsx` / `SuccessScreen.tsx` | `challenge_id`, `method`: `"web_share_api"` \| `"clipboard"`, `context`: `"play_complete"` \| `"create_success"` |
| `vote_submit` | `engagement` | 난이도 투표 | `features/difficulty-voting/ui/DifficultyVoting.tsx` | `challenge_id`, `difficulty` |
| `browse_other_click` | `engagement` | "다른 챌린지" 링크 클릭 | `features/game-play/ui/FinishedGameScreen.tsx` | `challenge_id` |

### 5. 챌린지 목록 (Challenges Page)

| 이벤트 | 카테고리 | 트리거 | 파일 | 파라미터 |
|--------|----------|--------|------|----------|
| `challenge_search` | `engagement` | 정렬 변경 | `app/challenges/page.tsx` | `sort_type`, `page_number` |

### 6. 마이 페이지 (My Page)

| 이벤트 | 카테고리 | 트리거 | 파일 | 파라미터 |
|--------|----------|--------|------|----------|
| `my_page_view` | `page` | 페이지 로드 | `app/my/page.tsx` | `challenge_count` |
| `device_link_action` | `engagement` | 기기 코드 복사/가져오기 | `app/my/page.tsx` | `action_type`: `"copy_code"` \| `"import_code"`, `success`: 0/1 |
| `challenge_manage_action` | `engagement` | 챌린지 관리 (공개/삭제) | `app/my/page.tsx` | `action_type`: `"toggle_public"` \| `"delete"`, `challenge_id` |

### 7. 설문조사 (Survey)

| 이벤트 | 카테고리 | 트리거 | 파일 | 파라미터 |
|--------|----------|--------|------|----------|
| `survey_action` | `engagement` | 배너 노출/클릭/닫기 | `shared/ui/SurveyBanner.tsx` | `action_type`: `"shown"` \| `"clicked"` \| `"dismissed"` |

### 8. 에러 추적 (Error Tracking)

| 이벤트 | 카테고리 | 트리거 | 파일 | 파라미터 |
|--------|----------|--------|------|----------|
| `image_upload_fail` | `error` | 이미지 업로드 실패 | `features/challenge-creation/api/challengeService.ts` | `error_type`: `"compression"` \| `"presigned_url"` \| `"storage_upload"` |

### 9. 트래픽 소스 (Traffic Acquisition)

| 이벤트 | 카테고리 | 트리거 | 파일 | 파라미터 |
|--------|----------|--------|------|----------|
| `traffic_source_captured` | `acquisition` | 세션 시작 (1회) | `shared/lib/analytics/trafficSource.ts` | `ts_source`, `ts_medium`, `ts_campaign`, `ts_referrer`, `ts_in_app_browser`, `ts_landing_page` |

**User Property**: `in_app_browser` — 인앱 브라우저 이름 또는 `"none"` (모든 이벤트에 자동 첨부)

---

## 주요 퍼널

### 챌린지 생성 퍼널

```
hero_cta_click (label=create) / bottom_cta_click
  → challenge_create_start
    → maker_step_complete (step=resource_upload)
      → maker_step_complete (step=round_config)
        → create_challenge
          → challenge_create_complete
            → challenge_create_share
```

### 게임 플레이 퍼널

```
challenge_card_click / play_page_view
  → speed_select (optional)
    → game_start
      → round_complete (x5)
        → game_complete
          → share_click → share_complete
          → vote_submit
          → game_replay
          → browse_other_click
```

### 랜딩 → 전환 퍼널

```
traffic_source_captured (세션 시작)
  → section_view (스크롤 진행)
    → hero_cta_click (play) → challenge_card_click → play_page_view
    → hero_cta_click (create) → challenge_create_start
    → view_all_click → challenge_search
```

---

## 이벤트 추가 가이드

새 이벤트를 추가할 때 다음을 확인한다:

1. **중복 확인**: 위 카탈로그에서 동일한 사용자 행동을 이미 추적하고 있는지 확인
2. **네이밍 규칙**: `{동사}_{명사}` 형식 (예: `share_click`, `game_start`)
3. **카테고리 분류**:
   - `landing` — 랜딩 페이지 인터랙션
   - `challenge` — 챌린지 생성 관련
   - `game` — 게임 플레이 관련
   - `engagement` — 공유, 투표 등 참여 행동
   - `page` — 페이지뷰
   - `error` — 에러/실패 추적
   - `acquisition` — 트래픽 소스
4. **파라미터**: `challenge_id`는 챌린지 관련 이벤트에 항상 포함
5. **구현 위치**: `gtag.ts`에 헬퍼 함수 추가 → 해당 컴포넌트에서 호출
6. **GA4 제한**: 이벤트 파라미터 이름에 GA4 예약어 사용 금지 (`ts_` 접두사 패턴 참고)

---

## GA4 대시보드 설정 필요 항목

아래 항목은 GA4 관리자 화면에서 수동으로 등록해야 효과적으로 분석할 수 있다:

### 커스텀 디멘션

| 파라미터 이름 | 스코프 | 설명 |
|--------------|--------|------|
| `ts_source` | Event | UTM source |
| `ts_medium` | Event | UTM medium |
| `ts_campaign` | Event | UTM campaign |
| `ts_referrer` | Event | 외부 레퍼러 호스트 |
| `ts_in_app_browser` | Event | 인앱 브라우저 이름 |
| `challenge_id` | Event | 챌린지 ID |
| `difficulty` | Event | 난이도 투표값 |
| `sort_type` | Event | 정렬 방식 |
| `speed` | Event | 재생 배속 |

### User Property

| 이름 | 설명 |
|------|------|
| `in_app_browser` | 인앱 브라우저 이름 (kakaotalk, naver 등) |
