# useMemo/useCallback 최소화 가이드

**핵심**: 메모이제이션은 성능 최적화 도구이지, 기본 패턴이 아니다.

## 사용하지 말아야 할 때

| 상황 | 이유 |
|------|------|
| 원시값 계산 | 메모이제이션 오버헤드 > 재계산 비용 |
| 가벼운 배열/객체 생성 | 대부분의 경우 재생성이 더 빠름 |
| 자식이 memo되지 않음 | 참조 안정성이 의미 없음 |
| 의존성이 매번 변경 | 캐싱 효과 없음 |

## 사용해야 할 때

### useMemo

```jsx
// ✅ 비용이 큰 계산 (O(n²) 이상, 대량 데이터)
const sorted = useMemo(() =>
  items.sort((a, b) => complexCompare(a, b)),
[items]);

// ✅ memo된 자식에 전달하는 객체
const style = useMemo(() => ({ color, size }), [color, size]);
<MemoizedChild style={style} />
```

### useCallback

```jsx
// ✅ memo된 자식에 전달하는 콜백
const handleClick = useCallback(() => onClick(id), [onClick, id]);
<MemoizedButton onClick={handleClick} />

// ✅ useEffect 의존성으로 사용되는 함수
const fetchData = useCallback(() => api.get(id), [id]);
useEffect(() => { fetchData(); }, [fetchData]);
```

## 판단 기준

메모이제이션 전 질문:

1. **실제 성능 문제가 있는가?** → 없으면 사용하지 않음
2. **React DevTools Profiler로 측정했는가?** → 측정 없이 최적화하지 않음
3. **자식 컴포넌트가 `memo()`로 감싸져 있는가?** → 아니면 무의미
4. **의존성이 자주 변경되는가?** → 그렇다면 캐싱 효과 없음

## 주의사항

- `memo()` 없이 `useCallback`/`useMemo`는 대부분 무의미
- 의존성 배열 관리 비용도 고려
- 조기 최적화는 복잡성만 증가시킴
- React Compiler(React 19+)가 자동 메모이제이션 처리 예정
