---
name: skeleton-ui
description: >
  스켈레톤 UI 구현 가이드. 로딩 상태 표시를 위한 스켈레톤 컴포넌트 작성 규칙을 제공합니다.
  트리거: 스켈레톤 추가해줘, 로딩 UI 만들어줘, Suspense fallback 구현해줘, 컴포넌트에 로딩 상태 추가 요청 시.
---

# Skeleton UI 구현 가이드

## 핵심 규칙

1. **위치**: 스켈레톤은 사용하는 컴포넌트 파일 내에 정의
2. **연결**: Suspense의 fallback prop으로 전달
3. **높이 일치**: 실제 콘텐츠와 동일한 높이 유지 (CLS 방지)

## 구현 패턴

```tsx
import { Suspense } from "react";

// 1. 스켈레톤 컴포넌트 정의 (동일 파일 내)
function MyComponentSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* 실제 콘텐츠와 동일한 높이/구조 유지 */}
      <div className="h-12 w-48 animate-pulse rounded bg-chalk-white/20" />
      <div className="h-24 w-full animate-pulse rounded bg-chalk-white/20" />
    </div>
  );
}

// 2. Suspense로 감싸서 사용
export function MyComponent() {
  return (
    <Suspense fallback={<MyComponentSkeleton />}>
      <MyComponentContent />
    </Suspense>
  );
}

// 3. 실제 데이터 페칭 컴포넌트
function MyComponentContent() {
  // 데이터 페칭 로직
  return <div>{/* 렌더링 */}</div>;
}
```

## 스켈레톤 스타일 (칠판 테마)

```tsx
// 기본 사용 - 칠판 배경에 맞는 스켈레톤
<div className="h-12 w-48 animate-pulse rounded bg-chalk-white/20" />

// 원형 스켈레톤
<div className="h-10 w-10 animate-pulse rounded-full bg-chalk-white/20" />

// 전체 너비
<div className="h-24 w-full animate-pulse rounded bg-chalk-white/20" />
```

## 네이밍 컨벤션

- `{ComponentName}Skeleton` 형식 사용
- 예: `BeatSlotGridSkeleton`, `ChallengeGridSkeleton`

## 체크리스트

- [ ] 스켈레톤이 실제 콘텐츠와 동일한 크기인가?
- [ ] Suspense의 fallback으로 연결했는가?
- [ ] 스켈레톤이 사용하는 컴포넌트와 같은 파일에 있는가?
- [ ] 칠판 테마에 맞는 색상을 사용하는가? (`bg-chalk-white/20`)
