# FSD Public API 가이드

## Public API 개념

Public API는 슬라이스가 외부에 노출하는 인터페이스입니다.
index.ts 파일을 통해 구현되며, 내부 구조를 캡슐화합니다.

```
features/game-play/
├── api/
├── hooks/
├── ui/
├── lib/
└── index.ts          ← Public API
```

### 목적

1. **구조 변경 보호**: 내부 리팩토링이 외부에 영향 주지 않음
2. **명시적 의존성**: 사용 가능한 것만 명확히 노출
3. **추상화**: 구현 세부사항 숨김

---

## index.ts 작성 규칙

### 기본 구조

```typescript
// features/game-play/index.ts

// UI 컴포넌트
export { GameStage } from "./ui/GameStage";
export { BeatSlotGrid } from "./ui/BeatSlotGrid";

// 훅
export { useAudioBeat, useGamePhase } from "./hooks";

// 타입
export type { GamePhase } from "./hooks/useGamePhase";
```

### 명시적 내보내기 원칙

```typescript
// ✅ 명시적 내보내기 (권장)
export { GameStage } from "./ui/GameStage";
export { useAudioBeat } from "./hooks";

// ❌ 와일드카드 내보내기 (피하기)
export * from "./ui";
export * from "./hooks";
```

### 타입과 값 분리

```typescript
// ✅ 타입은 type 키워드 사용
export type { Challenge, GameConfig } from "./model/types";

// ✅ 값은 일반 export
export { BEAT_COUNT, ROUND_COUNT } from "./model/constants";
```

---

## Import 패턴

### 권장 패턴

```typescript
// ✅ Public API를 통한 import
import { GameStage, useAudioBeat } from "@/features/game-play";
import { type Challenge } from "@/entities/challenge";
import { ChalkButton } from "@/shared/ui";
```

### 금지 패턴

```typescript
// ❌ 내부 구조 직접 접근
import { GameStage } from "@/features/game-play/ui/GameStage";
import { useAudioBeat } from "@/features/game-play/hooks/useAudioBeat";
```

### 예외: 슬라이스 내부

같은 슬라이스 내에서는 상대 경로로 직접 접근

```typescript
// features/game-play/ui/PlayingGameStage.tsx

// ✅ 같은 슬라이스 내부는 상대 경로
import { useGameBeatController } from "../hooks";

// ❌ 자기 자신의 index.ts 참조 금지 (순환 참조)
import { useGameBeatController } from "@/features/game-play";
```

---

## 순환 참조 방지

| 위치 | Import 방법 |
|------|-------------|
| 같은 슬라이스 내부 | 상대 경로 (`../hooks`) |
| 다른 슬라이스 | 절대 경로 (`@/entities/challenge`) |
| shared 레이어 | 절대 경로 (`@/shared/ui`) |

---

## 체크리스트

### index.ts 작성 시

- [ ] 명시적 export 사용 (와일드카드 피하기)
- [ ] 타입은 `export type` 사용
- [ ] 필요한 것만 노출 (내부 구현 숨김)

### Import 시

- [ ] Public API를 통한 import
- [ ] 내부 구조 직접 접근 금지
- [ ] 같은 슬라이스 내부는 상대 경로
- [ ] 자기 자신의 index.ts 참조 금지
