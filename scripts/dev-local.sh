#!/bin/bash
# 로컬 Supabase 환경으로 dev 서버를 실행한다.
# .env.local을 백업 → .env.test.local로 교체 → 종료 시 복원
#
# 사용법: ./scripts/dev-local.sh

set -e

ENV_FILE=".env.local"
TEST_ENV=".env.test.local"
BACKUP=".env.local.bak"

if [ ! -f "$TEST_ENV" ]; then
  echo "❌ $TEST_ENV 파일이 없습니다."
  exit 1
fi

# 백업
cp "$ENV_FILE" "$BACKUP"
echo "📦 .env.local 백업 완료 → $BACKUP"

# 교체: prod 값을 로컬 Supabase 값으로 덮어쓰기
# .env.test.local의 키만 교체하고 나머지(GA, R2 등)는 유지
while IFS='=' read -r key value; do
  # 빈 줄, 주석 스킵
  [[ -z "$key" || "$key" == \#* ]] && continue
  # .env.local에서 해당 키를 교체
  if grep -q "^${key}=" "$ENV_FILE"; then
    sed -i '' "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
  else
    echo "${key}=${value}" >> "$ENV_FILE"
  fi
done < "$TEST_ENV"

echo "🔄 로컬 Supabase 환경으로 전환 완료"
echo "   URL: http://127.0.0.1:54321"

# 종료 시 복원
cleanup() {
  cp "$BACKUP" "$ENV_FILE"
  rm -f "$BACKUP"
  echo ""
  echo "🔙 .env.local 원래 값으로 복원 완료"
}
trap cleanup EXIT

# dev 서버 실행
pnpm dev
