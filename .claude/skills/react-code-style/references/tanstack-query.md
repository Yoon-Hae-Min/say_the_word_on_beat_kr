# TanStack Query 사용 가이드

## 1. 기본 원칙

### 상태 분리
- **서버 상태(Server State)** 는 API를 통해 가져온 데이터 원본이다.
- **로컬 상태(Local State)** 는 UI 제어, 사용자 상호작용 등과 관련된 상태다.
- 두 상태는 절대 섞이지 않는다.
  - 서버 상태 훅은 **fetch 전용**
  - 로컬 상태 결합은 **해당 훅을 사용하는 컴포넌트**에서 수행한다.

---

## 2. 쿼리 훅 선택

| 상황 | 훅 |
|------|-----|
| 기본 데이터 fetching | `useQuery` |
| 조건부 fetch | `useQuery` + `enabled` |
| 폴링/백그라운드 갱신 UI | `useQuery` + `refetchInterval` |

> 이 프로젝트는 현재 `useQuery`를 주로 사용합니다. Suspense 패턴을 도입할 경우 `useSuspenseQuery`로 전환할 수 있습니다.

---

## 3. select 옵션 활용

### 깊은 중첩 데이터 추출
```tsx
const { data: challengeTitle } = useQuery({
  queryKey: ["challenge", id],
  queryFn: () => fetchChallenge(id),
  select: (data) => data.title,
});
```

### 주의사항
1. **원본 캐시 변경 금지** - select는 읽기 전용 변환
2. **함수 참조 안정성** - 인라인 함수는 매 렌더링마다 재계산
3. **의미적 재가공 금지** - 단순 접근/추출만 허용

---

## 4. 서버 상태 훅의 역할

### fetch 전용 원칙
- 서버 훅은 **데이터를 가져오고 캐싱하는 역할만** 수행한다.
- **비즈니스 로직, 필터링, 정렬, 계산, 로컬 상태 결합**은 절대 포함하지 않는다.

---

## 5. Mutation 규칙

- 서버 데이터를 변경하는 작업은 `useMutation`을 사용한다.
- 성공 시 관련 데이터의 최신화를 위해 **명시적으로 invalidate**를 수행한다.

```tsx
const mutation = useMutation({
  mutationFn: createChallenge,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["challenges"] }),
});
```

---

## 6. 요약

### 핵심 원칙
- 서버 상태 훅은 **fetch 전용**
- **로컬 상태 결합은 컴포넌트 단에서만** 수행
- **의미적 재가공 금지**, 단순 접근 편의만 허용
