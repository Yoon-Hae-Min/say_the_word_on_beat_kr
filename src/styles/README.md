# Design Tokens

이 프로젝트는 일관된 디자인 시스템을 위해 Tailwind CSS 기반 디자인 토큰을 사용합니다.

## 구조

모든 디자인 토큰은 `src/app/globals.css` 파일에서 CSS 변수로 정의되며, Tailwind CSS v4의 `@theme` 블록을 통해 자동으로 유틸리티 클래스로 변환됩니다.

## 사용 방법

### Tailwind 유틸리티 클래스로 사용 (권장)

```tsx
// 색상
<div className="bg-primary text-text-inverse" />
<div className="bg-surface text-text-main" />
<div className="bg-danger" />

// Border Radius
<div className="rounded-card" />
<button className="rounded-button" />

// 개별 색상
<div className="bg-blue-600" />
<div className="bg-slate-50" />
```

## 디자인 토큰 카테고리

### 색상 (Colors)

#### Primitive Colors
- **Blue**: 50, 500, 600 (Brand), 900
- **Slate**: 50, 900
- **Red**: 500
- **White**: #ffffff

#### Chalkboard Theme Colors
- **chalkboard-bg**: 칠판 배경 (#2F4F4F - Dark Slate Green)
- **wood-frame**: 나무 프레임 (#8B4513 - Saddle Brown)
- **chalk-white**: 흰색 분필 (#F5F5F5 - Off-White)
- **chalk-yellow**: 노란색 분필 (#FFFF33 - Vibrant Yellow)
- **chalk-blue**: 파란색 분필 (#87CEEB - Sky Blue)

#### Semantic Colors
- **primary**: 주요 브랜드 색상 (Blue 600)
- **primary-hover**: 주요 색상 hover 상태 (Blue 900)
- **background**: 배경 색상 (Slate 50 / Dark: Slate 900)
- **surface**: 표면 색상 (White)
- **text-main**: 주 텍스트 색상 (Slate 900 / Dark: White)
- **text-inverse**: 반전 텍스트 색상 (White)
- **danger**: 위험/오류 색상 (Red 500)

### 간격 (Spacing)
- **spacing-4**: 1rem
- **spacing-8**: 2rem

### Border Radius
- **radius-md**: 0.375rem
- **radius-full**: 9999px
- **radius-card**: md와 동일
- **radius-button**: full과 동일

## 다크 모드

다크 모드는 자동으로 지원됩니다:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--color-slate-900);
    --color-text-main: var(--color-white);
  }
}
```

## 예제

[DesignTokenExample.tsx](../components/DesignTokenExample.tsx)를 참고하세요.

### 버튼 예제

```tsx
// 일반 버튼
<button className="rounded-button bg-primary px-6 py-3 text-text-inverse hover:bg-primary-hover">
  Primary Button
</button>

// 칠판 테마 버튼
<button className="rounded-button bg-chalk-yellow px-6 py-3 text-chalkboard-bg hover:opacity-90">
  Yellow Chalk Button
</button>

<button className="rounded-button border-2 border-chalk-white bg-chalkboard-bg px-6 py-3 text-chalk-white hover:bg-wood-frame">
  Chalkboard Button
</button>
```

### 카드 예제

```tsx
<div className="rounded-card bg-surface p-6 shadow-lg">
  <h3 className="text-text-main">Card Title</h3>
  <p className="text-text-main opacity-80">Card content</p>
</div>

// 칠판 테마 카드
<div className="rounded-card bg-chalkboard-bg p-6 border-8 border-wood-frame">
  <h3 className="text-chalk-white">Chalkboard Card</h3>
  <p className="text-chalk-yellow">Yellow chalk text</p>
</div>
```

### CSS 변수로 직접 사용 (필요한 경우만)

```tsx
<div style={{ backgroundColor: 'var(--color-primary)' }}>
  Custom element
</div>
```

## 토큰 추가하기

`src/app/globals.css` 파일만 수정하면 됩니다:

1. `:root` 블록에 CSS 변수 추가
2. `@theme inline` 블록에 동일한 변수 추가
3. 다크 모드가 필요하면 `@media (prefers-color-scheme: dark)` 블록에 값 추가

```css
:root {
  --color-new-token: #123456;
}

@theme inline {
  --color-new-token: var(--color-new-token);
}
```

이제 `bg-new-token` 클래스로 사용할 수 있습니다.

## 베스트 프랙티스

1. **Semantic 토큰 우선 사용**: `bg-primary` > `bg-blue-600`
2. **일관성 유지**: 같은 용도에는 같은 토큰 사용
3. **명확한 이름 사용**: 용도를 나타내는 semantic 이름 선호
4. **다크 모드 고려**: 새 색상 추가 시 다크 모드 대응 확인
