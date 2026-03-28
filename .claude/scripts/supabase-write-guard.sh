#!/bin/bash
# Supabase write operation guard
# Blocks POST/PATCH/DELETE/PUT curl requests to Supabase REST API
# Allows GET (read) requests freely

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -z "$COMMAND" ] && exit 0

# Only check curl commands targeting Supabase
if echo "$COMMAND" | grep -q "supabase.co/rest"; then
  # Check for write methods: POST, PATCH, DELETE, PUT
  if echo "$COMMAND" | grep -qiE -- '-X\s*(POST|PATCH|DELETE|PUT)'; then
    METHOD=$(echo "$COMMAND" | grep -oiE '(POST|PATCH|DELETE|PUT)' | head -1)
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"ask\",\"permissionDecisionReason\":\"⚠️ Supabase 쓰기 작업 감지 (${METHOD}). 실행하시겠습니까?\"}}"
    exit 0
  fi
fi

# Also check for direct Supabase write scripts via node/npx
if echo "$COMMAND" | grep -qiE 'supabase.*(\.insert|\.update|\.delete|\.upsert|\.rpc)\s*\('; then
  echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"ask\",\"permissionDecisionReason\":\"⚠️ Supabase 클라이언트 쓰기 작업 감지. 실행하시겠습니까?\"}}"
  exit 0
fi

# Allow everything else (including GET/SELECT reads)
exit 0
