# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Say The Word On Beat KR** - A rhythm-based web game where users create and share "Say The Word On Beat" challenges. Users can create custom challenges by mapping images to 8-beat slots across 5 rounds, then share them for others to play.

**Tech Stack:**
- Next.js 16.1.0 (App Router) with React 19
- Supabase (PostgreSQL + Storage)
- TypeScript 5
- Tailwind CSS 4
- Biome (linting & formatting)

## Development Commands

```bash
# Development
pnpm dev                    # Start Next.js dev server on localhost:3000

# Build & Deploy
pnpm build                  # Production build
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # Run Biome linter with auto-fix
pnpm lint:check             # Check linting without auto-fix
pnpm format                 # Format code with Biome
pnpm format:check           # Check formatting without changes

# Database
pnpm gen:types              # Generate TypeScript types from Supabase schema
                            # Output: database.types.ts
```

## Architecture

This project follows **Feature-Sliced Design (FSD)** architecture with strict layer separation:

```
src/
├── app/                    # Next.js App Router (routing only)
│   ├── api/               # API routes (server-side endpoints)
│   ├── page.tsx           # Landing page
│   ├── maker/             # Challenge creation page
│   ├── play/[id]/         # Challenge playback page
│   └── challenges/        # Browse challenges page
│
├── widgets/               # Composite UI blocks (page sections)
│   ├── landing-hero/      # Hero section with CTA
│   ├── landing-feed/      # Challenge feed display
│   └── feature-showcase/  # Feature highlights
│
├── features/              # User interactions & business logic
│   ├── challenge-creation/   # Create challenge workflow
│   ├── challenge-start/      # Pre-creation modal (policy, privacy)
│   └── game-play/            # Play challenge (audio sync, beat timing)
│
├── entities/              # Business domain models
│   ├── challenge/         # Challenge data model & repository
│   └── resource/          # Resource (image + name) model
│
└── shared/                # Reusable utilities
    ├── api/supabase/      # Supabase client instances
    ├── lib/image/         # Image compression utilities
    └── ui/                # Chalkboard-themed components
```

### Key Architectural Patterns

**1. Data Flow Architecture**

- **Database Schema → Application Types**: Database types are auto-generated in `database.types.ts` using `pnpm gen:types`
- **Type Transformation Layer**: Each entity transforms database types to application-friendly types
  - Example: `DatabaseChallenge` (snake_case, raw DB) → `Challenge` (camelCase, UI-ready)

**2. Image Upload Flow (Presigned URLs)**

The app uses a secure presigned URL pattern to avoid exposing service keys:
1. Client requests presigned URL from `/api/upload/presigned-url` (server-side)
2. Server generates presigned URL using Supabase service key
3. Client uploads directly to Supabase Storage using presigned URL
4. Images are compressed client-side before upload (using `browser-image-compression`)

**3. Challenge Creation Pipeline**

Located in `src/features/challenge-creation/api/challengeService.ts`:
1. Compress all resource images
2. Upload images to Supabase Storage (via presigned URLs)
3. Build `game_config` array with image paths and display text
4. Insert challenge record with composite types (`beat_slot`, `game_config_struct`)

**4. Audio Beat Synchronization**

Located in `src/features/game-play/hooks/useAudioBeat.ts`:
- Uses `requestAnimationFrame` for precise beat timing
- Supports `offsetSec` parameter to shift beat detection earlier (compensates for visual latency)
- Formula: `beatIndex = floor((currentTime + offsetSec) / beatLength)`

**5. Supabase Client Architecture**

- **Client-side**: `src/shared/api/supabase/client.ts` (anonymous key, browser-safe)
- **Server-side**: `src/shared/api/supabase/server.ts` (service key, API routes only)

## Database Schema

**Main Table: `challenges`**

```typescript
{
  id: string (uuid)
  title: string
  is_public: boolean
  show_names: boolean          // Display answer text on slots
  thumbnail_url: string | null // Storage path to thumbnail
  game_config: game_config_struct[]
  view_count: number
  created_at: timestamp
}
```

**Composite Types:**

```typescript
beat_slot {
  imagePath: string | null     // Storage path (e.g., "abc-123.jpg")
  displayText: string | null   // Answer text (only if show_names=true)
}

game_config_struct {
  roundIndex: number
  slots: beat_slot[]           // Always 8 slots per round
}
```

**Storage Bucket:** `challenge-images` (public, auto-generated URLs)

**Database Functions:**
- `increment_view_count(row_id: uuid)`: Atomically increments view count

## Design System

The project uses a **chalkboard theme** with Tailwind CSS 4. All design tokens are defined in `src/app/globals.css` using CSS variables.

**Chalkboard Colors:**
- `chalkboard-bg`: Dark slate green (#2F4F4F)
- `wood-frame`: Saddle brown (#8B4513)
- `chalk-white`: Warm Cream (#E8E4DF)
- `chalk-yellow`: Soft Khaki Yellow (#F0E68C)
- `chalk-blue`: Muted Chalk Blue (#B4D4E4)

**Shared Components** (all in `src/shared/ui/`):
- `ChalkButton`: Chalk-styled button with hover effects
- `ChalkCard`: Card with wood frame border
- `WoodFrame`: Decorative wood border wrapper
- `ChalkDust`: Chalk particle effect overlay

**Style Guidelines:**
- Use semantic tokens over primitive colors (e.g., `bg-primary` not `bg-blue-600`)
- Always consider dark mode when adding new colors
- Maintain chalkboard aesthetic across all UI components

## Code Style & Conventions

**Biome Configuration:**
- Indentation: Tabs
- Line width: 100 characters
- Quotes: Double quotes
- Semicolons: Always
- Trailing commas: ES5 style
- Import organization: Auto-sorted on save

**TypeScript:**
- Strict mode enabled
- Use type imports: `import type { Foo } from "..."`
- Exhaustive dependency checks in hooks (warn level)

**Naming Conventions:**
- Components: PascalCase
- Files: camelCase for utilities, PascalCase for components
- Database fields: snake_case (auto-generated)
- Application types: camelCase

## Important Notes

**Image Handling:**
- All images are compressed before upload (max 1MB, 80% quality)
- Storage paths are relative (e.g., `uuid.jpg`), converted to full URLs on read
- Thumbnails default to first slot image if not explicitly set

**Type Safety:**
- Database types are source of truth (`database.types.ts`)
- Always run `pnpm gen:types` after Supabase schema changes
- Entity layers handle transformation between DB and app types

**Challenge Game Config:**
- Each challenge has exactly 5 rounds
- Each round has exactly 8 slots
- Empty slots have `imagePath: null` and `displayText: null`

**Audio Requirements:**
- BPM is hardcoded or configured per challenge
- Audio files must be accessible via public URL
- Beat timing uses `offsetSec` to compensate for render lag

## Documentation

```
docs/
├── local/                     # 로컬 전용 문서 (git-ignored, 인프라/운영 정보)
│   └── infrastructure.md      # 시스템 아키텍처 전체 그림
│                                - Request flow (Cloudflare → Vercel → Supabase/R2)
│                                - Domain & DNS 구성 (word-on-beat.store)
│                                - Cloudflare 설정 (SSL, Cache Rule)
│                                - Vercel Hobby Plan 리소스 제한
│                                - 외부 서비스 연동 (Supabase, R2, GA4)
│                                - 비용 구조 (전 서비스 무료 티어)
│
├── metrics/                   # 기능별 지표 정의 (출시 전 작성)
│   ├── README.md              # 지표 프레임워크 — 배경/가설/기준선/성공기준 템플릿
│   ├── speed-control.md       # 배속 선택 기능 지표 (출시됨 2026-04-04, 결과 포함)
│   └── flexible-round-count.md # 라운드 수 유연화 지표 (계획 중)
│
└── reports/                   # 기능별 주간 성과 리포트 (자동 생성)
    ├── speed-control/
    │   └── 2026-04-13.md
    └── flexible-round-count/
        └── 2026-04-13.md
```

**`docs/local/`** — git에 포함되지 않는 로컬 전용 문서. 인프라 구성, 시크릿 관련 맥락 등 외부에 공개하지 않는 정보를 담는다. 새 개발자 온보딩이나 인프라 의사결정 시 참조.

**`docs/metrics/`** — 기능 출시 전 "어떤 지표로 성공을 판단할지" 사전 정의. README.md의 프레임워크(배경→가설→기준선→North Star→성공기준)를 따른다.

**`docs/reports/`** — 출시된 기능의 실제 GA4 데이터 기반 주간 리포트. metrics에서 정의한 성공 기준과 대조하여 pass/fail 판정.

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=      # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=     # Supabase service role key (server-only)
```

See `.env.example` for reference.