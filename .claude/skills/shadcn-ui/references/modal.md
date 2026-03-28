# Dialog/Sheet 모달 가이드

## Dialog (중앙 모달)

```tsx
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>열기</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>제목</DialogTitle>
      <DialogDescription>설명 텍스트</DialogDescription>
    </DialogHeader>
    {/* 콘텐츠 */}
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">취소</Button>
      </DialogClose>
      <Button>확인</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 제어 모드 (Controlled)

```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <Button onClick={() => setOpen(false)}>닫기</Button>
  </DialogContent>
</Dialog>
```

## 주의사항

- `DialogTrigger`에 커스텀 버튼 사용 시 `asChild` 필수
- 접근성: `DialogTitle`과 `DialogDescription` 권장
