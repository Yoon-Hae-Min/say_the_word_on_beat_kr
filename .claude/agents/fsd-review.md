---
name: fsd-review
description: Call this agent at the start of any new feature development to determine the correct folder structure and file placement. It is essential for refactoring complex dependencies or resolving ambiguity between layers like entities and features. Use this prompt during the design phase to strictly enforce FSD principles, ensuring your project remains maintainable and scalable.
model: sonnet
---

# 🧱 Feature-Sliced Design 지침서 (실전 적용용)

---

## 1. 사고 관점 (설계 철학)

- 구조는 기술 중심이 아니라 "비즈니스 도메인과 기능" 중심으로 나눈다.

- 수평적 폴더 분할이 아니라, 기능별로 수직적으로 모듈을 분리해 격리한다.

- 모듈 간 의존성은 단방향으로 흐르게 설계해 구조를 안정화한다.

- 각 코드 조각이 어떤 기능에 속해 있는지 명확하게 파악 가능해야 한다.

- 도메인을 중심으로 사고하되, 사용자 행동을 기능 단위로 분리한다.

- "재사용 가능성"보다 "맥락 분리"와 "변경 가능성 고립"을 더 우선시한다.

- 점진적 도입을 염두에 두고, 작게 쪼개어 리팩토링하는 방식을 권장한다.

---

## 2. 레이어 구조와 책임 (Layer)

- `app/`

전역 설정, 진입점, 전역 Provider, 라우팅, 전역 스타일이 들어간다.

예: `AppRouter`, `ThemeProvider`, `QueryClientProvider`, `document.tsx`

- `pages/`

라우트 단위의 UI 구성 책임을 가진다.

비즈니스 로직은 여기서 구현하지 않고, 위젯과 기능을 조합해 사용한다.

각 페이지는 독립적이며 외부에서만 위젯/기능을 조립한다.

- `widgets/`

여러 Feature나 Entity를 조합하여 만든 재사용 가능한 UI 블록이다.

예: 검색 바, 댓글 섹션, 상품 카드 리스트 등.

자체 상태를 가질 수 있지만, 비즈니스 로직은 feature나 entity에 위임한다.

- `features/`

사용자 행동 단위로 나눈 기능 모듈이다.

예: 로그인, 게시물 좋아요, 장바구니에 추가 등.

UI와 상태, API 요청까지 하나의 폴더 내에서 캡슐화한다.

- `entities/`

비즈니스 도메인 모델 단위다.

예: 사용자(User), 상품(Product), 게시물(Post), 댓글(Comment) 등.

상태(model), UI, 스키마, API 등이 해당 도메인 단위로 묶인다.

- `shared/`

프로젝트 전체에서 재사용 가능한 범용 코드가 들어간다.

비즈니스나 기능과 무관해야 하며, 순수 유틸리티, 디자인 시스템, 공통 API client 등이 들어간다.

shared에 포함된 유틸 함수, 컴포넌트는 반드시 테스트 코드를 포함해야 한다.

---

## 3. 도메인 구분 기준 (Entity vs Feature)

- 도메인(Entity)을 나눌 때는 데이터 구조 중심으로 생각한다.

예: API 명세 상 주요 리소스나 테이블 단위로 끊는다.

여러 기능이 공통으로 다루는 주제이면 entity로 분리한다.

예: 사용자(User), 상품(Product), 장바구니(Cart) 등

- 기능(Feature)을 나눌 때는 사용자 행동 중심으로 생각한다.

예: 특정한 목적이나 트리거(행위)에 따라 분리한다.

예: 로그인, 상품 추가, 댓글 제출, 알림 읽기 등

기능은 UI와 상태, 서버 요청까지 하나의 흐름으로 캡슐화한다.

---

## 4. Slice와 Segment

- Slice는 기능 또는 도메인 단위로 나눈 폴더다.

예: `entities/user/`, `features/login/`

Slice는 외부에 `index.ts`를 통해서만 공개 API를 제공하고, 내부 구조는 외부에서 직접 접근할 수 없다.

- Segment는 Slice 내부 폴더 구조이며 기술 목적별로 나눈다.

다음과 같은 이름을 쓴다:

- `ui/`: 컴포넌트, 스타일, 비주얼 요소

- `model/`: 상태 관리, 비즈니스 로직, store

- `api/`: 서버 요청, API 모듈

- `lib/`: 해당 slice 내부에서만 쓰는 유틸 함수

- `config/`: 설정, 상수값

- Segment는 목적을 명확히 드러내는 네이밍을 써야 한다.

❌ 예: `components/`, `hooks/`, `utils/` 등은 기술 관점이므로 지양

✅ 예: `ui/`, `model/`, `api/`, `lib/` 등은 역할과 의도를 분명히 표현함

- barrel파일은 index.ts라는 이름으로 지정해야하고 해당 파일은 Segment내에서만 존재해야 한다.

---

## 5. 의존성 흐름 규칙 (단방향 계층)

- 모든 모듈은 아래 방향으로만 참조할 수 있다.

상위 계층을 참조하면 안 된다.

- `app` → `pages` → `widgets` → `features` → `entities` → `shared`

- 예를 들어 `features/order/`는 `entities/product/`는 참조할 수 있지만,

`widgets/cart-summary/`는 참조할 수 없다.

- 이를 통해 순환 참조를 방지하고 변경 영향도를 최소화한다.

---

## 6. shared 관리 및 테스트 기준

- shared에는 다음과 같은 코드만 위치해야 한다:

- 전역적으로 재사용되는 디자인 시스템 컴포넌트 (예: Button, Modal)

- 순수 유틸 함수 (날짜 포맷, 숫자 포매터 등)

- API 클라이언트 설정, 공통 타입 정의

- 글로벌 설정값, config, 테마, i18n 등

- shared에 포함된 모든 유틸 함수와 UI 컴포넌트는 테스트 코드를 반드시 작성해야 한다:

- 유틸 함수는 단위 테스트 (jest 등)

- 컴포넌트는 렌더링 테스트 또는 Storybook 포함

- 다음과 같은 경우는 shared에 넣지 않는다:

- 도메인에 강하게 의존하는 유틸 코드

- 로그인, 정렬, 필터링 등 흐름이 포함된 로직

- 특정 feature나 entity에 종속된 컴포넌트

---

## 7. Layer / Slice / Segment 관계 정의

- Layer는 앱의 전반적인 책임 범위에 따라 구분한 구조이다.

예: `widgets`, `features`, `entities`, `shared` 등

- Slice는 각 Layer 안에서 기능이나 도메인 기준으로 나눈 하위 단위이다.

예: `features/login`, `entities/user` 등

- Segment는 Slice 내부에서 기술 목적에 따라 구분한 폴더 단위이다.

예: `ui`, `model`, `api`, `lib`, `config`

- 전체 구조는 다음과 같은 계층적 관계를 가진다:

- Layer는 여러 개의 Slice를 가진다

- Slice는 여러 Segment로 구성된다

- Segment 안에는 실제 코드가 위치한다

- 위와 같은 계층을 무조건 따라야 한다.

- 참조 규칙:

- Layer 간: 상위 → 하위로만 참조

- Layer 내부: Slice 간 직접 참조 ❌

- Slice 내부: Segment 간 자유롭게 참조 가능
