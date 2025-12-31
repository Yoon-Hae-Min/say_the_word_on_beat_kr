---
name: react-solid
description: Call this agent to inject five design principles optimized for React and FSD architecture into your code. It ensures structural flexibility through layer-based responsibility separation (SRP) and composition-based expansion (OCP) while designing predictable, standard-compliant interfaces (LSP). By removing unnecessary data dependencies (ISP) and enforcing dependency inversion (DIP) through abstracted hooks, it guarantees high-quality frontend code resilient to technological shifts.
---

# React 개발자를 위한 SOLID 원칙 심화 가이드라인

이 문서는 React와 TypeScript 환경에서 견고한 애플리케이션을 설계하기 위한 SOLID 원칙 적용 가이드입니다. 단순한 개념 정의를 넘어, **"왜 이렇게 작성해야 하는가?"**에 대한 설계적 타당성을 확보하는 데 중점을 두었습니다.

## 1. SRP (Single Responsibility Principle) - 단일 책임 원칙

### 📖 개념 정의

**"하나의 컴포넌트(모듈)는 변경해야 하는 이유가 단 하나여야 한다."** React에서 '책임'은 크게 **UI 렌더링, 상태 관리, 비즈니스 로직(데이터 페칭 등)**으로 나뉩니다. 이들이 한 컴포넌트에 섞여 있으면 유지보수가 급격히 어려워집니다.

### 🧐 왜 중요한가요?

1. **가독성:** 코드를 읽을 때 "이 컴포넌트는 화면을 그리는 역할이구나"라고 즉시 파악할 수 있습니다.
2. **재사용성:** 로직이 없는 순수 UI 컴포넌트는 다른 페이지나 프로젝트에서 재사용하기 쉽습니다.
3. **테스트 용이성:** 로직(Hook)과 UI(Component)를 분리하면, UI 테스트와 로직 단위 테스트를 따로 진행할 수 있어 효율적입니다.

### ❌ Anti-Pattern: 만능 컴포넌트 (God Component)

하나의 컴포넌트가 데이터도 가져오고, 데이터를 가공하고, UI도 그립니다. API 스펙이 바뀌어도 이 파일을 수정해야 하고, 디자인이 바뀌어도 이 파일을 수정해야 합니다.

```
// UserProfile.tsx
export const UserProfile = () => {
  const [user, setUser] = useState<any>(null);

  // 1. 데이터 페칭 책임
  useEffect(() => {
    fetch('/api/user').then(res => res.json()).then(data => setUser(data));
  }, []);

  // 2. 데이터 가공 로직 책임
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  if (!user) return <div>Loading...</div>;

  // 3. UI 렌더링 책임
  return (
    <div className="card">
      <h1>{user.name}</h1>
      <p>Joined: {formatDate(user.joinedAt)}</p>
    </div>
  );
};
```

### ✅ Best Practice: 책임의 분리

UI 컴포넌트는 데이터를 **어떻게** 가져오는지 몰라야 합니다. 오직 **무엇을** 보여줄지만 신경 씁니다.

1. **Container/Presentational 패턴** 혹은 **Custom Hook** 패턴을 사용합니다.
2. 유틸리티 함수(날짜 포맷팅 등)는 별도 파일로 분리합니다.

```
// hooks/useUser.ts (데이터 책임)
// 변경 이유: API 엔드포인트 변경, 데이터 캐싱 전략 변경 등
export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 복잡한 비동기 로직이 이곳에 숨겨집니다.
    userService.getUser().then(setUser);
  }, []);

  return user;
};

// utils/date.ts (가공 로직 책임)
// 변경 이유: 날짜 표시 형식이 'YYYY-MM-DD'에서 'MM/DD/YYYY'로 변경될 때
export const formatDate = (date: string) => new Date(date).toLocaleDateString();

// components/UserProfile.tsx (UI 책임)
// 변경 이유: 레이아웃 변경, CSS 클래스 변경, 디자인 시스템 교체 등
export const UserProfile = () => {
  const user = useUser(); // 데이터는 Hook에게 위임

  if (!user) return <LoadingSpinner />;

  return (
    <UserCard>
      <UserName>{user.name}</UserName>
      <JoinDate>{formatDate(user.joinedAt)}</JoinDate>
    </UserCard>
  );
};
```

## 2. OCP (Open/Closed Principle) - 개방-폐쇄 원칙

### 📖 개념 정의

**"확장에는 열려 있어야 하고, 변경에는 닫혀 있어야 한다."** 기존 컴포넌트의 소스 코드를 직접 수정하지 않고도, 새로운 요구사항(새로운 디자인, 새로운 기능)을 반영할 수 있어야 합니다.

### 🧐 왜 중요한가요?

1. **안전성:** 잘 동작하고 있는 기존 코드를 건드리지 않으므로, 수정으로 인한 사이드 이펙트(버그) 발생 확률이 줄어듭니다.
2. **유연성:** 라이브러리 수준의 컴포넌트(공용 컴포넌트)를 만들 때 필수적입니다. 사용하는 쪽에서 입맛대로 커스터마이징할 수 있어야 합니다.

### ❌ Anti-Pattern: 수많은 Boolean Props와 조건문

새로운 요구사항이 생길 때마다 Props를 추가하고 내부에서 `if-else` 분기를 늘리는 방식입니다.

```
interface HeaderProps {
  isHome?: boolean;
  isProfile?: boolean; // 페이지가 늘어날 때마다 prop 추가?
  showSearch?: boolean;
}

export const Header = ({ isHome, isProfile, showSearch }: HeaderProps) => {
  return (
    <header>
      <Logo />
      {/* 내부 코드를 계속 수정해야 함 */}
      {isHome && <HomeMenu />}
      {isProfile && <ProfileMenu />}
      {showSearch && <SearchBar />}
    </header>
  );
};
```

### ✅ Best Practice: 합성(Composition)과 주입(Injection)

컴포넌트가 **무엇을 렌더링할지 결정하지 않고**, 부모에게 제어권을 넘깁니다. `children` prop이나 `ReactNode` 타입의 prop을 적극 활용합니다.

```
interface HeaderProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

// 뼈대(Layout)만 제공하고 내용은 비워둠 (변경에 닫힘)
export const Header = ({ left, center, right }: HeaderProps) => {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="left-section">{left}</div>
      <div className="center-section">{center}</div>
      <div className="right-section">{right}</div>
    </header>
  );
};

// 사용하는 곳에서 조합 (확장에 열림)
// 홈 페이지
<Header
  left={<Logo />}
  center={<HomeNav />}
  right={<LoginButton />}
/>

// 프로필 페이지
<Header
  left={<BackButton />}
  center={<Title>Profile</Title>}
  right={<SettingsIcon />}
/>
```

## 3. LSP (Liskov Substitution Principle) - 리스코프 치환 원칙

### 📖 개념 정의

**"자식 타입은 부모 타입을 대체할 수 있어야 한다."** React 관점에서는 **"사용자가 컴포넌트를 직관적으로 예측 가능한 방식으로 사용할 수 있어야 한다"**는 의미로 해석됩니다. 특정 컴포넌트가 표준 HTML 요소나 일반적인 관례를 깨뜨리면 안 됩니다.

### 🧐 왜 중요한가요?

1. **예측 가능성:** 개발자는 `Button` 컴포넌트라면 당연히 `onClick`이 될 것이고, `Input`이라면 `value`를 가질 것이라고 기대합니다. 이 기대가 깨지면 API 문서를 매번 찾아봐야 합니다.
2. **호환성:** 표준 인터페이스를 따르면, 다른 라이브러리나 헬퍼 함수들과 쉽게 연동됩니다.

### ❌ Anti-Pattern: 예측 불가능한 Props 네이밍 및 동작

표준 `button` 태그를 래핑하면서, 표준 속성을 지원하지 않거나 제멋대로 이름을 바꾼 경우입니다.

```
interface MyButtonProps {
  text: string;
  action: () => void; // 표준인 onClick 대신 action 사용
  // className, style, disabled 등 표준 속성 지원 안 함
}

export const MyButton = ({ text, action }: MyButtonProps) => {
  return <button onClick={action}>{text}</button>;
};

// 문제점:
// <MyButton className="mt-4" /> -> 적용 안 됨
// <MyButton disabled /> -> 적용 안 됨
// <MyButton onClick={...} /> -> 타입 에러 (action을 써야 함)
```

### ✅ Best Practice: 인터페이스 상속과 Prop Forwarding

TypeScript의 `ComponentProps` 유틸리티 등을 사용하여 표준 HTML 속성을 그대로 상속받고, `...props`를 통해 전달합니다.

```
// React.ButtonHTMLAttributes를 상속받아 모든 버튼 속성을 지원
interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'; // 추가 속성만 정의
}

export const MyButton = ({ variant = 'primary', className, ...props }: MyButtonProps) => {
  return (
    <button
      // 커스텀 로직 (스타일링)
      className={`btn-${variant} ${className}`}
      // 나머지 모든 표준 속성 전달 (onClick, disabled, type, aria-label 등)
      {...props}
    />
  );
};

// 사용 시: 표준 버튼처럼 자연스럽게 사용 가능
<MyButton
  variant="secondary"
  onClick={handleClick}
  disabled={isLoading}
  aria-label="Submit Form"
/>
```

## 4. ISP (Interface Segregation Principle) - 인터페이스 분리 원칙

### 📖 개념 정의

**"클라이언트는 자신이 사용하지 않는 메서드(데이터)에 의존하면 안 된다."** React에서는 **컴포넌트에 필요한 최소한의 Props만 전달하라**는 뜻입니다. 불필요하게 큰 객체를 통째로 넘기면, 해당 객체의 관련 없는 부분이 변경되어도 불필요한 리렌더링이 발생하거나 결합도가 높아집니다.

### 🧐 왜 중요한가요?

1. **성능 최적화:** `memo`를 사용할 때, 관련 없는 데이터 변경으로 인한 리렌더링을 막을 수 있습니다.
2. **결합도 감소:** 컴포넌트가 특정 데이터 구조(예: User 객체 전체)에 종속되지 않게 하여, 더 범용적으로 사용할 수 있습니다.

### ❌ Anti-Pattern: 통째로 넘기기

`UserCard`는 이름과 이미지만 필요한데, 거대한 `user` 객체 전체를 받습니다. 만약 `user.password`나 `user.loginHistory`가 변경되어 객체 참조가 바뀌면, `UserCard`도 불필요하게 영향을 받을 수 있습니다.

```
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  address: string;
  preferences: any;
  // ... 수많은 필드
}

interface UserCardProps {
  user: User; // 너무 큰 의존성
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <div>
      <img src={user.profileImg} />
      <span>{user.name}</span>
    </div>
  );
};
```

### ✅ Best Practice: 필요한 것만 정의하기 (Props Narrowing)

컴포넌트가 실제로 사용하는 데이터만 명시적으로 Props로 정의합니다.

```
interface UserCardProps {
  name: string;
  imageUrl: string;
}

// User 객체가 없어도, name과 imageUrl만 있으면 어디서든 사용 가능
export const UserCard = ({ name, imageUrl }: UserCardProps) => {
  return (
    <div>
      <img src={imageUrl} alt={name} />
      <span>{name}</span>
    </div>
  );
};

// 사용하는 상위 컴포넌트에서 필요한 데이터만 골라서(Pick) 전달
const Page = ({ user }: { user: User }) => {
  return <UserCard name={user.name} imageUrl={user.profileImg} />;
};
```

## 5. DIP (Dependency Inversion Principle) - 의존성 역전 원칙

### 📖 개념 정의

**"고수준 모듈(컴포넌트)은 저수준 모듈(구체적인 구현)에 의존해서는 안 된다. 둘 다 추상화에 의존해야 한다."** UI 컴포넌트(고수준)가 특정 라이브러리나 API 호출 방식(저수준)에 직접 묶여 있으면 안 됩니다. 대신 "데이터를 요청한다"는 추상적인 행위에 의존해야 합니다.

### 🧐 왜 중요한가요?

1. **기술 부채 관리:** `fetch`를 쓰다가 `axios`로 바꾸거나, `React Query`로 마이그레이션할 때, UI 컴포넌트 코드는 한 줄도 건드리지 않아도 됩니다.
2. **스토리북/테스트:** 실제 API 서버가 없어도, Mock 데이터를 리턴하는 가짜 훅이나 함수를 주입하여 UI를 쉽게 테스트할 수 있습니다.

### ❌ Anti-Pattern: 컴포넌트 내부의 강한 결합

컴포넌트가 `localStorage`라는 구체적인 브라우저 API에 직접 의존하고 있습니다. 이 컴포넌트는 서버 사이드 렌더링(SSR) 환경이나 `cookie` 저장소로 변경 시 깨지게 됩니다.

```
// ThemeButton.tsx
export const ThemeButton = () => {
  const toggleTheme = () => {
    // 저수준 구현(localStorage)에 직접 의존
    const current = localStorage.getItem('theme');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    // ...
  };

  return <button onClick={toggleTheme}>Toggle Theme</button>;
};
```

### ✅ Best Practice: Context API 또는 Hook을 통한 추상화

컴포넌트는 `useTheme`이라는 인터페이스(추상화)에만 의존합니다. 내부가 `localStorage`인지 `cookie`인지, 혹은 전역 상태 라이브러리인지는 알 필요가 없습니다.

```
// 1. 추상화 인터페이스 정의 (계약)
interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

// 2. 구현체 (Provider) - 이곳에서만 구체적인 로직(localStorage 등)을 다룸
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  const toggleTheme = () => {
    // 로직 구현...
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. 컴포넌트 (고수준 모듈)
// 오직 "toggleTheme 기능이 있다"는 사실에만 의존
export const ThemeButton = () => {
  const { toggleTheme } = useTheme(); // 추상화된 훅 사용

  return <button onClick={toggleTheme}>Toggle Theme</button>;
};
```
