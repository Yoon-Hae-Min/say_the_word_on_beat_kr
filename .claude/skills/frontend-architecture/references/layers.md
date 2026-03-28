# FSD 레이어 상세 가이드

## 레이어 개요

```
app/        ← 가장 상위 (Next.js App Router + 전역 설정)
widgets/    ← 복합 UI 블록
features/   ← 사용자 행동 단위
entities/   ← 비즈니스 도메인
shared/     ← 가장 하위 (공용 유틸)
```

**핵심 규칙**: 상위 레이어는 하위 레이어만 import 가능

---

## App 레이어

### 책임

- Next.js App Router 라우팅
- 전역 Provider 설정 (QueryProvider 등)
- 전역 스타일 (`globals.css`)
- API 라우트 (`api/`)
- SEO (sitemap, robots.txt, layout metadata)

### 포함 요소

```
app/
├── layout.tsx          # 전역 레이아웃, Provider 조립
├── page.tsx            # 랜딩 페이지
├── globals.css         # 전역 스타일
├── sitemap.ts          # SEO
├── maker/page.tsx      # 챌린지 생성
├── play/[id]/          # 챌린지 플레이
├── challenges/         # 챌린지 목록
├── api/                # API 라우트
├── privacy/            # 정적 페이지
└── terms/              # 정적 페이지
```

### 주의사항

- 비즈니스 로직 포함 금지
- 위젯과 기능을 조합하여 페이지 구성
- API 라우트는 서버 전용 로직만 포함

---

## Widgets 레이어

### 책임

- 여러 Features/Entities 조합한 재사용 가능한 UI 블록
- 페이지 섹션 단위 컴포넌트
- 비즈니스 로직은 feature/entity에 위임

### 포함 요소

```
widgets/
├── landing-hero/       # 히어로 섹션
├── landing-feed/       # 챌린지 피드
├── landing-footer/     # 푸터
└── feature-showcase/   # 기능 소개
```

### 주의사항

- features나 entities 직접 참조 가능
- 다른 widget 참조 금지
- 페이지에 종속되지 않는 독립적 블록

---

## Features 레이어

### 책임

- 사용자 행동 단위 기능 구현
- UI + 상태 + API 요청 캡슐화
- 재사용 가능한 비즈니스 로직

### 포함 요소

```
features/
├── challenge-creation/   # 챌린지 만들기 워크플로우
│   ├── ui/
│   ├── hooks/
│   ├── api/
│   └── lib/
├── challenge-start/      # 시작 전 모달
├── game-play/            # 게임 플레이 (비트 동기화, 라운드)
└── difficulty-voting/    # 난이도 투표
```

### 주의사항

- entities와 shared만 참조 가능
- 다른 feature 참조 금지
- 사용자 행동 중심으로 분리

---

## Entities 레이어

### 책임

- 비즈니스 도메인 모델 정의
- 데이터 구조, 타입, API 호출
- DB 타입 → 앱 타입 변환

### 포함 요소

```
entities/
├── challenge/
│   ├── api/        # repository.ts, queries.ts
│   ├── model/      # types.ts (Challenge, DatabaseChallenge)
│   └── index.ts
└── resource/
    ├── model/      # types.ts (Resource)
    └── index.ts
```

### 주의사항

- shared만 참조 가능
- 다른 entity 참조 금지
- 데이터 중심으로 분리

---

## Shared 레이어

### 책임

- 프로젝트 전체에서 재사용 가능한 범용 코드
- 비즈니스 로직 포함 금지

### 포함 요소

```
shared/
├── api/supabase/     # Supabase 클라이언트 (client.ts, server.ts)
├── api/queryClient.ts # React Query 설정
├── ui/               # 칠판 테마 컴포넌트 (ChalkButton, ChalkCard 등)
├── hooks/            # 공용 훅 (usePagination, useSort 등)
├── lib/              # 유틸 (image 압축, analytics, difficulty 계산)
├── components/       # JsonLd, GA, UserInitializer
├── provider/         # QueryProvider, LocationJsProvider
└── types/            # Branded types
```

### 주의사항

- 다른 레이어 참조 절대 금지
- 비즈니스 로직 포함 금지
- 슬라이스 없이 세그먼트만 존재

---

## 의존성 규칙

### 허용되는 Import

| 레이어   | import 가능                          |
| -------- | ------------------------------------ |
| app      | widgets, features, entities, shared  |
| widgets  | features, entities, shared           |
| features | entities, shared                     |
| entities | shared                               |
| shared   | 내부만                               |

### 금지되는 Import

```typescript
// ❌ 상위 레이어 참조
// entities/challenge/api/repository.ts
import { GameStage } from "@/features/game-play"; // 금지

// ❌ 같은 레이어 내 다른 슬라이스 참조
// entities/challenge/api/repository.ts
import { Resource } from "@/entities/resource"; // 금지

// ❌ shared에서 다른 레이어 참조
// shared/lib/utils.ts
import { useChallenge } from "@/entities/challenge"; // 금지
```
