# Supabase Integration - Implementation Complete

## Overview
Successfully integrated Supabase database and storage with GraphQL, presigned URLs, and image compression.

## What Was Implemented

### 1. Environment Configuration
- Created [.env.example](.env.example) with required Supabase environment variables
- **Action Required**: Create `.env.local` file with your actual Supabase credentials:
  ```bash
  cp .env.example .env.local
  # Then edit .env.local with your Supabase project credentials
  ```

### 2. Supabase Client Setup
- [src/lib/supabase/client.ts](src/lib/supabase/client.ts) - Browser-side client (anon key)
- [src/lib/supabase/server.ts](src/lib/supabase/server.ts) - Server-side client (service role key)
- [src/lib/supabase/graphql.ts](src/lib/supabase/graphql.ts) - GraphQL helpers using pg_graphql

### 3. Image Compression
- [src/lib/image/compression.ts](src/lib/image/compression.ts)
- Settings: 500KB max, 1280px dimensions, 0.7 quality
- Uses `browser-image-compression` library

### 4. Presigned URL API
- [src/app/api/upload/presigned-url/route.ts](src/app/api/upload/presigned-url/route.ts)
- Generates secure 60-second presigned upload URLs
- Validates image-only uploads

### 5. Challenge Services
- [src/features/challenge-creation/api/challengeService.ts](src/features/challenge-creation/api/challengeService.ts)
  - `compressAndUploadImage()` - Compress and upload single image
  - `createChallenge()` - Upload all images and create challenge in database

- [src/features/game-play/api/challengeService.ts](src/features/game-play/api/challengeService.ts)
  - `getChallengeById()` - Fetch challenge from database
  - `incrementViewCount()` - Increment view counter

### 6. Updated Components

#### ResourcePanel
- [src/features/challenge-creation/ui/ResourcePanel.tsx](src/features/challenge-creation/ui/ResourcePanel.tsx:27-68)
- Now compresses images on upload
- Shows "압축 중..." status during compression
- Stores compressed File objects instead of base64

#### ChallengeCreationForm
- [src/features/challenge-creation/ui/ChallengeCreationForm.tsx](src/features/challenge-creation/ui/ChallengeCreationForm.tsx:127-151)
- Replaced localStorage with Supabase `createChallenge()` service
- Added loading states and error handling
- Shows upload progress feedback

#### PlayPage
- [src/app/play/[id]/page.tsx](src/app/play/[id]/page.tsx:22-44)
- Replaced localStorage with Supabase `getChallengeById()` service
- Increments view count on load
- Fetches images from Supabase storage

### 7. Type Definitions
- [src/entities/challenge/model/types.ts](src/entities/challenge/model/types.ts:29-53)
- Added `GameConfig`, `GameConfigRound`, `GameConfigSlot`, `DatabaseChallenge` types
- Matches database JSONB schema

## Database Schema

The application expects the following table structure in Supabase:

```sql
create table public.challenges (
  id uuid not null default gen_random_uuid (),
  title text not null,
  is_public boolean not null default false,
  view_count bigint not null default 0,
  game_config jsonb not null,
  created_at timestamp with time zone not null default now(),
  constraint challenges_pkey primary key (id)
);
```

### game_config JSONB Structure
```json
{
  "rounds": [
    {
      "roundIndex": 1,
      "slots": [
        {
          "imagePath": "challenge-images/uuid.jpg",
          "displayText": "단어"
        }
      ]
    }
  ],
  "songUrl": "https://external-music-url.com/song.mp3"
}
```

## Storage Bucket

- **Bucket name**: `challenge-images`
- **Access**: Public read access required
- **Upload**: Via presigned URLs only

## Setup Instructions

### 1. Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Create a new project
3. Note your project URL and API keys

### 2. Set Up Database
The `challenges` table should already exist (as per your initial message).

If RLS policies aren't set up, add these:

```sql
-- Allow anyone to insert challenges
CREATE POLICY "Anyone can insert challenges"
ON challenges FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to select public challenges
CREATE POLICY "Anyone can view public challenges"
ON challenges FOR SELECT
TO anon, authenticated
USING (is_public = true);

-- Allow anyone to update view counts
CREATE POLICY "Anyone can update view counts"
ON challenges FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
```

### 3. Set Up Storage
The `challenge-images` bucket should already exist.

Storage policies (if not set up):

```sql
-- Allow anyone to upload to challenge-images
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'challenge-images');

-- Allow anyone to read images
CREATE POLICY "Anyone can read images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'challenge-images');
```

### 4. Enable GraphQL
Supabase's `pg_graphql` extension should be enabled by default. Verify in:
- Supabase Dashboard → Database → Extensions → pg_graphql (should be enabled)

### 5. Configure Environment Variables
Create `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials from Supabase Dashboard → Settings → API:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 6. Test the Integration
1. Start the dev server: `pnpm dev`
2. Go to the maker page
3. Upload some images (should show "압축 중..." during compression)
4. Fill in all slots and create a challenge
5. Should show "이미지 업로드 중..." during upload
6. On success, you'll get a challenge ID
7. Visit the play page to verify the challenge loads from Supabase

## Key Features

✅ **Client-side image compression** - Reduces upload time and storage costs
✅ **Presigned URLs** - Secure direct-to-storage uploads
✅ **GraphQL API** - Type-safe database queries using pg_graphql
✅ **Loading states** - User feedback during compression and upload
✅ **Error handling** - Graceful error messages
✅ **View counter** - Automatically increments on challenge load

## Flow Diagram

```
User uploads image
  ↓
Client compresses image (500KB max)
  ↓
Client shows preview
  ↓
User clicks "생성하기"
  ↓
For each image:
  ├→ Request presigned URL from API route
  ├→ Upload compressed file to Supabase Storage
  └→ Get storage path
  ↓
Build game_config JSONB with image paths
  ↓
Insert challenge record via GraphQL
  ↓
Return challenge ID
  ↓
Show success modal
```

## Files Created

1. `.env.example` - Environment variable template
2. `src/lib/supabase/client.ts` - Browser client
3. `src/lib/supabase/server.ts` - Server client
4. `src/lib/supabase/graphql.ts` - GraphQL helpers
5. `src/lib/image/compression.ts` - Image compression utility
6. `src/app/api/upload/presigned-url/route.ts` - Presigned URL API
7. `src/features/challenge-creation/api/challengeService.ts` - Creation service
8. `src/features/game-play/api/challengeService.ts` - Retrieval service

## Files Modified

1. `src/entities/challenge/model/types.ts` - Added database types
2. `src/features/challenge-creation/ui/ResourcePanel.tsx` - Added compression
3. `src/features/challenge-creation/ui/ChallengeCreationForm.tsx` - Supabase integration
4. `src/app/play/[id]/page.tsx` - Fetch from Supabase

## Next Steps

1. **Configure your `.env.local`** with real Supabase credentials
2. **Test the entire flow** from creation to playback
3. **Optional**: Add error boundaries for better error handling
4. **Optional**: Implement the landing page feed to show public challenges
5. **Optional**: Add image upload progress bars (currently just loading message)

## Troubleshooting

### GraphQL Errors
- Verify pg_graphql extension is enabled in Supabase
- Check that your table schema matches exactly
- Test queries in Supabase Dashboard → API → GraphQL

### Upload Errors
- Check storage bucket exists and is named `challenge-images`
- Verify storage policies allow public uploads
- Check CORS settings in Supabase Storage settings

### 404 on Play Page
- Verify the challenge ID is correct
- Check if challenge exists in database
- Verify is_public is true if querying public challenges

### Environment Variable Errors
- Make sure `.env.local` exists (not `.env`)
- Restart dev server after adding env variables
- Check variable names match exactly (case-sensitive)
