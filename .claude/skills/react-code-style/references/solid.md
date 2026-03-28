# React 개발자를 위한 SOLID 원칙 심화 가이드라인

## 1. SRP (Single Responsibility Principle) - 단일 책임 원칙

**"하나의 컴포넌트는 변경해야 하는 이유가 단 하나여야 한다."**

### ❌ Anti-Pattern: 만능 컴포넌트
```tsx
export const ChallengeCard = () => {
  const [challenge, setChallenge] = useState(null);
  useEffect(() => {
    fetch('/api/challenge').then(res => res.json()).then(setChallenge);
  }, []);
  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  if (!challenge) return <div>Loading...</div>;
  return <div>{challenge.title} - {formatDate(challenge.createdAt)}</div>;
};
```

### ✅ Best Practice: 책임 분리
```tsx
// hooks/useChallengeQuery.ts (데이터 책임)
export const useChallengeQuery = () => useQuery({ ... });

// lib/dateUtils.ts (가공 로직 책임)
export const formatDate = (date: string) => new Date(date).toLocaleDateString();

// ui/ChallengeCard.tsx (UI 책임)
export const ChallengeCard = ({ title, createdAt }: ChallengeCardProps) => (
  <div>{title} - {formatDate(createdAt)}</div>
);
```

## 2. OCP (Open/Closed Principle) - 개방-폐쇄 원칙

**"확장에는 열려 있고, 변경에는 닫혀 있어야 한다."**

### ✅ Best Practice: 합성(Composition)
```tsx
interface GameLayoutProps {
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
}

export const GameLayout = ({ header, content, footer }: GameLayoutProps) => (
  <div className="flex flex-col h-full">
    <div>{header}</div>
    <div className="flex-1">{content}</div>
    <div>{footer}</div>
  </div>
);
```

## 3. LSP (Liskov Substitution Principle) - 리스코프 치환 원칙

### ✅ Best Practice: 인터페이스 상속
```tsx
interface ChalkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const ChalkButton = ({ variant = "primary", className, ...props }: ChalkButtonProps) => (
  <button className={cn("chalk-btn", variant, className)} {...props} />
);
```

## 4. ISP (Interface Segregation Principle) - 인터페이스 분리 원칙

### ✅ Best Practice: 필요한 Props만 전달
```tsx
// ❌ Challenge 객체 전체를 넘기지 않음
interface ChallengeCardProps { challenge: Challenge; }

// ✅ 필요한 것만 명시
interface ChallengeCardProps {
  title: string;
  thumbnailUrl: string;
  viewCount: number;
}
```

## 5. DIP (Dependency Inversion Principle) - 의존성 역전 원칙

### ✅ Best Practice: Hook을 통한 추상화
```tsx
// 컴포넌트는 "게임 상태를 관리한다"는 추상화에만 의존
export const GameStage = () => {
  const { phase, currentRound } = useGamePhase();
  return <div>{/* phase에 따른 UI */}</div>;
};
```
