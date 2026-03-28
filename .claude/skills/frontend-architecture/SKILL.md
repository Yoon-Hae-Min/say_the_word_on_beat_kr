---
name: frontend-architecture
description: "Feature-Sliced Design(FSD) 아키텍처 지침서. 새로운 컴포넌트, 기능, 페이지 생성 시 FSD 패턴에 따른 올바른 폴더 구조와 의존성 규칙을 적용합니다. 프론트엔드 아키텍처 설계, 리팩토링, 코드 리뷰 시 사용합니다. (project)"
---

# Feature-Sliced Design 지침서

## 핵심 개념

FSD는 프론트엔드 애플리케이션을 **비즈니스 도메인과 기능 중심**으로 구조화하는 아키텍처 방법론입니다.

### 설계 원칙

- 기술이 아닌 비즈니스 도메인 중심 분할
- 기능별 수직적 모듈 격리
- 단방향 의존성 흐름
- 재사용성보다 맥락 분리와 변경 격리 우선

## 레이어 구조

```
app/        ← Next.js App Router (라우팅 + 전역 설정)
widgets/    ← 복합 UI 블록 (features/entities 조합)
features/   ← 사용자 행동 단위 기능 (챌린지 생성, 게임 플레이 등)
entities/   ← 비즈니스 도메인 모델 (Challenge, Resource 등)
shared/     ← 공용 유틸, UI 컴포넌트, 설정
```

**의존성 규칙**: 상위 → 하위 방향으로만 import 가능

> **Note**: 이 프로젝트는 Next.js App Router를 사용하므로 `pages/` 레이어 없이 `app/`이 라우팅과 전역 설정을 동시에 담당합니다.

## 슬라이스 구조

각 슬라이스는 세그먼트로 구성:

```
features/challenge-creation/
├── api/       # 서버 통신 (challengeService.ts)
├── hooks/     # React 훅 (useChallengeForm.ts 등)
├── ui/        # UI 컴포넌트
├── lib/       # 슬라이스 전용 유틸 (validation.ts)
└── index.ts   # Public API
```

## 빠른 참조

| 작업 | 레이어 | 예시 |
|------|--------|------|
| 공통 UI 컴포넌트 | `shared/ui/` | ChalkButton, ChalkCard, WoodFrame |
| 도메인 데이터/API | `entities/[name]/` | challenge, resource |
| 사용자 액션 기능 | `features/[name]/` | challenge-creation, game-play |
| 복합 UI 블록 | `widgets/[name]/` | landing-hero, landing-feed |
| 라우트 페이지 | `app/[route]/` | maker, play/[id], challenges |

## 의존성 체크리스트

새 코드 작성 시 확인:

- [ ] 상위 레이어 import 없음
- [ ] 같은 레이어 내 다른 슬라이스 import 없음 (shared 제외)
- [ ] shared 레이어 코드는 다른 레이어 import 없음
- [ ] Public API(index.ts)를 통한 import

## Import 패턴

```typescript
// ✅ 권장
import { ChalkButton } from "@/shared/ui";
import { type Challenge } from "@/entities/challenge";
import { GameStage } from "@/features/game-play";
import { HeroSection } from "@/widgets/landing-hero";

// ❌ 금지 - 내부 구조 직접 접근
import { ChalkButton } from "@/shared/ui/ChalkButton";
import { Challenge } from "@/entities/challenge/model/types";
```

## 네이밍 규칙

- 컴포넌트 파일: PascalCase (`ChallengeCreationForm.tsx`)
- 유틸/훅 파일: camelCase (`useChallengeForm.ts`, `validation.ts`)
- 슬라이스: kebab-case, 도메인 중심 (`challenge-creation`, `game-play`)

## 상세 가이드

- **레이어별 상세 책임과 예시**: [references/layers.md](references/layers.md)
- **슬라이스/세그먼트 상세 규칙**: [references/segments.md](references/segments.md)
- **Public API(index.ts) 규칙**: [references/public-api.md](references/public-api.md)
