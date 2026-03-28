---
name: react-code-style
description: "React/TypeScript 코드 스타일 및 설계 원칙 가이드. SOLID 원칙 적용, Provider 패턴, TanStack Query 사용 규칙을 포함합니다. React 컴포넌트 설계, 상태 관리 패턴, 훅 작성 시 사용합니다. (project)"
---

# React 코드 스타일 가이드

## 핵심 원칙

### SOLID 원칙
- **SRP**: 컴포넌트는 단일 책임 - UI/상태/로직 분리
- **OCP**: 합성(Composition)으로 확장, 내부 수정 없이
- **LSP**: 표준 HTML 속성 상속, 예측 가능한 인터페이스
- **ISP**: 필요한 Props만 전달, 객체 통째로 넘기지 않음
- **DIP**: Context/Hook으로 구체 구현 추상화

### Provider 패턴
- 전역 Provider는 `shared/provider/`에 라이브러리별 분리
- 조립은 `app/layout.tsx`에서 의존성 순서대로
- 클라이언트 전용 Provider는 `"use client"` 필수

### React Query 규칙
- 서버 상태 훅은 fetch 전용 (로컬 상태 결합 금지)
- Mutation 성공 시 명시적 invalidate
- Suspense 활용 시 로딩/에러 경계 분리

### useEffect 최소화
- Effect는 **외부 시스템 동기화에만** 사용
- 파생 상태 → 일반 변수 또는 `useMemo`
- 이벤트 응답 → 이벤트 핸들러로 이동
- props 변경 리셋 → `key` prop 사용
- 데이터 fetching → React Query 사용

### 메모이제이션 최소화
- `useMemo`/`useCallback`은 **측정된 성능 문제에만** 사용
- `memo()` 없는 자식에 전달 시 useCallback 무의미
- 단순 계산은 직접 수행 (메모이제이션 오버헤드 > 재계산)
- 컴포넌트 분리로 해결 가능한지 먼저 검토

## 상세 가이드

중요: 아래 상세가이드를 전부 읽은후 적용을 해야한다

| 주제 | 파일 |
|------|------|
| SOLID 원칙 심화 | [references/solid.md](references/solid.md) |
| Provider 패턴 | [references/provider.md](references/provider.md) |
| TanStack Query | [references/tanstack-query.md](references/tanstack-query.md) |
| useEffect 최소화 | [references/useeffect.md](references/useeffect.md) |
| 메모이제이션 최소화 | [references/memoization.md](references/memoization.md) |
