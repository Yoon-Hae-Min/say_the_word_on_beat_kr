### 1) 개요
- 전역적으로 Provider가 필요한 경우 `shared/provider/` 폴더에 생성한다.
- 각 라이브러리(예: react-query, theme 등)별로 파일을 하나씩 생성한다.
- 전역 Provider는 반드시 `app/layout.tsx`에서 조립한다.

---

### 2) 목적
- 전역 의존성을 한 지점에서 관리해 **복잡도를 줄이고 구조를 명확히** 한다.
- Next.js App Router의 계층 구조와 자연스럽게 통합된다.
- 각 Provider의 책임을 분리하여 **중복 선언과 전역 오염을 방지**한다.

---

### 3) 현재 구조
```
shared/provider/
├── QueryProvider.tsx        # React Query
└── LocationJsProvider.tsx   # Locator.js (개발 도구)
```

---

### 4) 작성 원칙
1. **라이브러리 단위 분리** — Query, Theme, Auth 등 독립 관리
2. **Provider 내부에는 초기화 + 래핑만** — 비즈니스 로직, 훅 분리
3. **조립 순서 명시** — 의존성에 따라 순서 보장
4. **`"use client"` 지시어 필수** — 클라이언트 전용 Provider는 파일 상단에 추가

---

### 5) 결정 트리

- **전역적으로 항상 필요한 경우**
  → `shared/provider/`에 생성하고, `app/layout.tsx`에서 전역으로 조립한다.

- **특정 라우트에서만 필요한 경우**
  → 해당 라우트의 `layout.tsx`에서만 Provider를 감싼다.

- **특정 페이지에서만 필요한 경우**
  → 해당 페이지 컴포넌트 내부에서 직접 Provider를 감싼다.

- **클라이언트 전용 Provider인 경우**
  → 파일 상단에 `"use client"` 지시어를 추가한다.
