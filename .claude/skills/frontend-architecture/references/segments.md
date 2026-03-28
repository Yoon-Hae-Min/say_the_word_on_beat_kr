# FSD 슬라이스와 세그먼트 상세 가이드

## 슬라이스 개념

슬라이스는 레이어 내에서 비즈니스 도메인 또는 기능 단위로 나눈 폴더입니다.

```
entities/
├── challenge/     ← 슬라이스
└── resource/      ← 슬라이스

features/
├── challenge-creation/   ← 슬라이스
├── challenge-start/      ← 슬라이스
├── game-play/            ← 슬라이스
└── difficulty-voting/    ← 슬라이스
```

### 핵심 원칙

**1. 높은 응집도** — 관련 코드를 하나의 슬라이스에 모음
**2. 낮은 결합도** — 같은 레이어의 다른 슬라이스 참조 금지
**3. Public API 제공** — index.ts를 통해 외부에 필요한 것만 노출

---

## 세그먼트 유형

### ui/

UI 컴포넌트 (PascalCase 파일명)

```
features/game-play/ui/
├── GameStage.tsx
├── BeatSlotGrid.tsx
├── PlayingGameStage.tsx
└── FinishedGameScreen.tsx
```

### hooks/

React 훅 (camelCase 파일명)

```
features/challenge-creation/hooks/
├── useChallengeForm.ts
├── useImageUpload.ts
├── useChallengeSubmission.ts
└── index.ts
```

### api/

서버 통신 관련 코드

```
entities/challenge/api/
├── repository.ts    # Supabase 데이터 접근
├── queries.ts       # React Query 훅
└── index.ts
```

### model/

데이터 모델, 타입 정의

```
entities/challenge/model/
├── types.ts         # Challenge, DatabaseChallenge 타입
└── index.ts
```

### lib/

슬라이스 전용 유틸리티 함수

```
features/challenge-creation/lib/
└── validation.ts    # 챌린지 유효성 검사
```

---

## 세그먼트 간 참조

같은 슬라이스 내 세그먼트는 서로 참조 가능

```typescript
// features/game-play/ui/PlayingGameStage.tsx
import { useGameBeatController } from "../hooks"; // ✅ 허용
import { beatCalculations } from "../lib/beatCalculations"; // ✅ 허용
```

---

## 네이밍 규칙

### 슬라이스 네이밍

```
✅ 좋은 예시
entities/challenge/        # 단수형, 도메인 중심
features/game-play/        # 기능 중심, kebab-case
widgets/landing-hero/      # 페이지 섹션 중심

❌ 나쁜 예시
entities/challenges/       # 복수형 피하기
features/GamePlay/         # PascalCase 피하기
```

### 파일 네이밍

```
✅ 이 프로젝트의 컨벤션
UI 컴포넌트:    PascalCase (GameStage.tsx, BeatSlotGrid.tsx)
훅:            camelCase  (useChallengeForm.ts, useAudioBeat.ts)
유틸/서비스:    camelCase  (challengeService.ts, validation.ts)
타입:          camelCase  (types.ts)
```

---

## Cross-Import 문제

### 해결 방법

**1. 상위 레이어에서 조합**

```typescript
// widgets/landing-feed/ui/FeedSection.tsx
import { Challenge } from "@/entities/challenge";
import { DifficultyBadge } from "@/shared/ui";
```

**2. shared로 공통 코드 추출**

```typescript
// shared/ui/DifficultyBadge.tsx
// 여러 feature에서 사용하는 공통 UI
```
