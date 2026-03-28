---
name: design-guide
description: "칠판 테마 디자인 시스템 가이드. UI 컴포넌트, 스타일, 레이아웃 작업 시 일관된 칠판(Chalkboard) 디자인 패턴과 토큰을 적용합니다. 트리거: 새 컴포넌트/페이지 생성, 스타일 수정 요청 시. (project)"
---

# 칠판 테마 디자인 시스템 가이드

## 핵심 원칙

- Tailwind CSS 4 `@theme` 기반 칠판 테마 색상 시스템
- 커스텀 칠판 컴포넌트(`@/shared/ui/`) 우선 사용
- 필요 시 shadcn/ui(`src/components/ui/`) 보조 사용
- 손글씨 폰트(`--font-hand`)로 칠판 느낌 강조

## 색상 시스템

### 칠판 테마 색상

| CSS 변수 | Tailwind 클래스 | 값 | 용도 |
|----------|----------------|-----|------|
| `--color-chalkboard-bg` | `bg-chalkboard-bg` | #2F4F4F | 메인 배경 (Dark Slate Green) |
| `--color-wood-frame` | `bg-wood-frame` | #8B4513 | 나무 프레임 (Saddle Brown) |
| `--color-chalk-white` | `text-chalk-white` | #F5F5F5 | 기본 텍스트 (Off-White) |
| `--color-chalk-yellow` | `text-chalk-yellow` | #FFFF33 | 강조, 제목 (Vibrant Yellow) |
| `--color-chalk-blue` | `text-chalk-blue` | #87CEEB | 보조 강조 (Sky Blue) |

### 시맨틱 색상

| 용도 | Tailwind 클래스 | 사용 예시 |
|------|----------------|-----------|
| 기본 배경 | `bg-chalkboard-bg` | 페이지 전체 배경 |
| 나무 프레임 | `bg-wood-frame` | WoodFrame 컴포넌트 |
| 기본 텍스트 | `text-chalk-white` | 본문, 설명 |
| 제목/강조 | `text-chalk-yellow` | h1, 주요 타이틀 |
| 링크/보조 | `text-chalk-blue` | 링크, 보조 정보 |
| 에러 | `text-danger` | 에러 메시지 |

### 용도별 가이드

```tsx
// 제목
<h1 className="chalk-text text-chalk-yellow text-2xl">챌린지 만들기</h1>

// 본문
<p className="text-chalk-white">설명 텍스트</p>

// 보조 텍스트 (투명도 활용)
<span className="text-chalk-white/60">보조 설명</span>

// 배경
<div className="bg-chalkboard-bg min-h-screen">페이지</div>

// 카드/섹션
<div className="bg-chalkboard-bg/80 rounded-lg p-4">섹션</div>
```

## 유틸리티 클래스

### 칠판 효과

| 클래스 | 용도 |
|--------|------|
| `chalk-text` | 손글씨 폰트 적용 |
| `chalk-border` | 분필 느낌 테두리 |
| `chalk-dust` | 분필 가루 그림자 효과 |
| `hover-wiggle` | 호버 시 흔들리는 애니메이션 |
| `organic-rotate-1/2/3` | 자연스러운 미세 회전 |
| `animate-fade-in` | 페이드인 애니메이션 |
| `animate-wiggle-1/2/3/4` | 흔들리는 애니메이션 (무한) |

## 칠판 테마 컴포넌트 (`@/shared/ui/`)

| 컴포넌트 | 용도 |
|----------|------|
| `ChalkButton` | 칠판 스타일 버튼 (호버 효과) |
| `ChalkCard` | 나무 프레임 테두리 카드 |
| `WoodFrame` | 나무 프레임 래퍼 |
| `ChalkDust` | 분필 파티클 오버레이 |
| `ChalkSelect` | 칠판 스타일 셀렉트 |
| `DifficultyBadge` | 난이도 뱃지 |
| `DifficultyText` | 난이도 텍스트 |
| `ErrorDisplay` | 에러 표시 |
| `EmptyState` | 빈 상태 표시 |
| `LoadingState` | 로딩 상태 표시 |
| `PaginationControls` | 페이지네이션 |

## 컴포넌트 체크리스트

새 컴포넌트 작성 시:

- [ ] 칠판 테마 색상 사용 (`chalkboard-bg`, `chalk-white`, `chalk-yellow` 등)
- [ ] 텍스트에 `chalk-text` 클래스 적용 (제목/강조)
- [ ] hover/focus 상태에 칠판 효과 사용 (`hover-wiggle` 등)
- [ ] 기존 칠판 컴포넌트 재사용 가능한지 확인
- [ ] 에러/빈 상태 스타일 정의
- [ ] 접근성 속성 추가 (aria-*, role)

## 페이지 체크리스트

새 페이지 작성 시:

- [ ] `bg-chalkboard-bg min-h-screen` 배경 설정
- [ ] 칠판 테마 컴포넌트로 레이아웃 구성
- [ ] 로딩 상태 (Skeleton/LoadingState)
- [ ] 빈 상태 (EmptyState)
- [ ] 에러 상태 (ErrorDisplay)
- [ ] 반응형 대응
