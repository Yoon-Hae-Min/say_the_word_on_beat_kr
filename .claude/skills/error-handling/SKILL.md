---
name: error-handling
description: "에러 처리 가이드. Suspense/ErrorBoundary 배치, 에러 UI 구현, mutation 에러 처리 패턴을 제공합니다. 트리거: 에러 처리 추가, ErrorBoundary 구현, 에러 페이지 만들기, API 에러 핸들링, 에러 UI 구현 요청 시."
---

# Error Handling Guide

## 패턴 선택

| 상황 | 패턴 | 이유 |
|------|------|------|
| 페이지 메인 데이터 | Suspense + ErrorBoundary | 선언적, 자동 로딩/에러 |
| 보조/선택 데이터 | `useQuery` + 수동 처리 | 캐시 데이터 유지 가능 |
| 폼 제출 | `useMutation` + try-catch + toast | 세밀한 에러 메시지 |
| 독립 섹션 다수 | 섹션별 개별 ErrorBoundary | 독립적 에러 상태 |

## ErrorBoundary 배치 규칙

**핵심 원칙**: 에러는 발생한 컴포넌트 영역 내에서만 표시, 나머지 UI는 정상 유지

```tsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

// 스켈레톤은 같은 파일에 정의
function MyContentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-12 w-full animate-pulse rounded bg-chalk-white/20" />
      <div className="h-24 w-full animate-pulse rounded bg-chalk-white/20" />
    </div>
  );
}

// 에러 UI
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 p-8 text-chalk-white">
      <p>문제가 발생했습니다</p>
      <p className="text-sm text-chalk-white/60">{error.message}</p>
      <button onClick={resetErrorBoundary} className="chalk-text underline">
        다시 시도
      </button>
    </div>
  );
}

// 정적 UI는 ErrorBoundary 바깥에 배치
export function MyPage() {
  return (
    <main>
      <h1 className="chalk-text text-chalk-yellow">페이지 제목</h1>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<MyContentSkeleton />}>
          <MyContent />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
```

### 스코핑 체크리스트

- [ ] 제목/설명 등 정적 요소가 ErrorBoundary **바깥**에 있는가?
- [ ] 독립적으로 로딩되는 섹션은 **별도** ErrorBoundary로 감싸는가?
- [ ] 에러 시 관련 없는 영역이 깨지지 않는가?

## Mutation 에러 처리

```tsx
const handleSubmit = async (data: FormData) => {
  try {
    await mutation.mutateAsync(data);
    // 성공 처리
  } catch (error) {
    let errorMessage = "저장에 실패했습니다";

    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // toast 또는 에러 UI 표시
    console.error(errorMessage);
  }
};
```

## 에러 메시지 규칙

- 한글, 명사형 종결
- 맥락 포함: "챌린지 생성에 실패했습니다" (O) / "오류가 발생했습니다" (X)
- 사용자 액션 제공: "다시 시도" 버튼

## Next.js 에러 처리

### not-found.tsx

```tsx
// app/play/[id]/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-chalkboard-bg">
      <div className="text-center text-chalk-white">
        <h1 className="chalk-text text-4xl text-chalk-yellow">404</h1>
        <p className="mt-4">챌린지를 찾을 수 없습니다</p>
      </div>
    </div>
  );
}
```

### error.tsx

```tsx
// app/play/[id]/error.tsx
"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-chalkboard-bg">
      <div className="text-center text-chalk-white">
        <h1 className="chalk-text text-2xl text-chalk-yellow">문제가 발생했습니다</h1>
        <p className="mt-2 text-chalk-white/60">{error.message}</p>
        <button onClick={reset} className="mt-4 chalk-text underline">
          다시 시도
        </button>
      </div>
    </div>
  );
}
```
