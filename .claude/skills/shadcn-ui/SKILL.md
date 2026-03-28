---
name: shadcn-ui
description: "shadcn/ui 컴포넌트 사용 가이드. UI 컴포넌트 추가/수정, Form 구현, Dialog/Sheet 모달 작업 시 사용. 트리거: shadcn 컴포넌트 추가, UI 컴포넌트 커스터마이징, Form/Dialog 구현 요청. (project)"
---

# shadcn/ui 가이드

## 프로젝트 설정

```
스타일: new-york
아이콘: lucide
경로: src/components/ui/
유틸: @/lib/utils
```

> **Note**: 이 프로젝트는 칠판 테마의 커스텀 UI(`@/shared/ui/`)와 shadcn/ui(`src/components/ui/`)를 병행 사용합니다. 칠판 테마 컴포넌트(ChalkButton, ChalkCard 등)는 `@/shared/ui/`에 있습니다.

## CLI 명령어

```bash
# 컴포넌트 추가
pnpm dlx shadcn@latest add [component]

# 덮어쓰기
pnpm dlx shadcn@latest add [component] -o
```

## 핵심 원칙

### 컴포넌트 구조
- shadcn/ui는 라이브러리가 아닌 **복사 가능한 코드**
- 컴포넌트는 `src/components/ui/`에 위치
- 커스터마이징은 해당 파일 직접 수정

### Variants 패턴 (cva)
```tsx
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});
```

### asChild 패턴
```tsx
<Button asChild>
  <Link href="/home">홈으로</Link>
</Button>
```

## 현재 설치된 컴포넌트

| 컴포넌트 | 위치 |
|----------|------|
| Badge | `src/components/ui/badge.tsx` |
| Select | `src/components/ui/select.tsx` |

## 상세 가이드

| 주제 | 파일 |
|------|------|
| Form + react-hook-form | [references/form.md](references/form.md) |
| Dialog/Sheet 모달 | [references/modal.md](references/modal.md) |
