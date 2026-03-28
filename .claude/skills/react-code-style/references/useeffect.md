# useEffect 최소화 가이드

**핵심**: Effect는 외부 시스템 동기화에만 사용한다.

## 리팩토링 판단 기준

| 질문 | 조치 |
|------|------|
| 렌더링 중 계산 가능? | 변수 또는 `useMemo` |
| 사용자 이벤트 응답? | 이벤트 핸들러로 이동 |
| props 변경 시 리셋? | `key` prop 사용 |
| 데이터 fetching? | React Query 사용 |
| 외부 시스템 동기화? | useEffect 유지 |

## 패턴별 리팩토링

### 파생 상태 → 직접 계산

```jsx
// ❌
const [filtered, setFiltered] = useState([]);
useEffect(() => setFiltered(items.filter(i => i.active)), [items]);

// ✅
const filtered = items.filter(i => i.active);
```

### 이벤트 응답 → 핸들러로 이동

```jsx
// ❌
useEffect(() => { if (submitted) showToast('완료'); }, [submitted]);

// ✅
const handleSubmit = () => { submitForm(); showToast('완료'); };
```

### Props 리셋 → key 사용

```jsx
// ❌
useEffect(() => setComment(''), [postId]);

// ✅ 부모에서
<CommentForm key={postId} postId={postId} />
```

### Fetching → React Query

```jsx
// ❌
useEffect(() => { fetch(`/api/challenge/${id}`).then(setChallenge); }, [id]);

// ✅
const { data: challenge } = useQuery({ queryKey: ['challenge', id], queryFn: () => fetchChallenge(id) });
```

## 유지해야 하는 경우

```jsx
// Audio API 동기화 (이 프로젝트의 핵심 패턴)
useEffect(() => {
  const audio = audioRef.current;
  audio.play();
  return () => audio.pause();
}, [audioSrc]);

// requestAnimationFrame (비트 동기화)
useEffect(() => {
  const id = requestAnimationFrame(updateBeat);
  return () => cancelAnimationFrame(id);
}, [updateBeat]);

// DOM 이벤트
useEffect(() => {
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

## 주의사항

- `useMemo`는 실제 성능 문제 시에만 적용
- Strict Mode에서 두 번 실행 시 cleanup 누락 의심
- 의존성 배열 lint 경고 무시하지 않기
