#!/usr/bin/env node

/**
 * 고아 이미지 정리 스크립트
 *
 * R2에 저장되어 있지만 DB의 어떤 챌린지에도 참조되지 않는 이미지를 찾아 삭제한다.
 *
 * Usage:
 *   node scripts/cleanup-orphan-images.mjs              # Dry run (삭제 안 함, 목록만 출력)
 *   node scripts/cleanup-orphan-images.mjs --delete      # 실제 삭제 실행
 */

import { DeleteObjectsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

// --- Config ---

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
	console.error("Missing R2 environment variables");
	process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
	console.error("Missing Supabase environment variables");
	process.exit(1);
}

const isDryRun = !process.argv.includes("--delete");

// --- Clients ---

const r2 = new S3Client({
	region: "auto",
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// --- Step 1: R2의 모든 파일 목록 수집 ---

async function listAllR2Objects() {
	const allKeys = [];
	let continuationToken = undefined;
	let totalSize = 0;

	console.log("R2 버킷의 모든 파일을 조회하는 중...");

	while (true) {
		const response = await r2.send(
			new ListObjectsV2Command({
				Bucket: R2_BUCKET_NAME,
				ContinuationToken: continuationToken,
				MaxKeys: 1000,
			}),
		);

		if (response.Contents) {
			for (const obj of response.Contents) {
				allKeys.push({ key: obj.Key, size: obj.Size || 0 });
				totalSize += obj.Size || 0;
			}
		}

		if (!response.IsTruncated) break;
		continuationToken = response.NextContinuationToken;
	}

	console.log(`  R2 파일 수: ${allKeys.length}개`);
	console.log(`  R2 총 용량: ${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`);

	return { keys: allKeys, totalSize };
}

// --- Step 2: DB에서 참조 중인 이미지 경로 수집 ---

async function getReferencedPaths() {
	const referencedPaths = new Set();

	console.log("DB에서 참조 중인 이미지 경로를 수집하는 중...");

	// 페이지네이션으로 전체 챌린지 조회
	let offset = 0;
	const limit = 500;
	let totalChallenges = 0;

	while (true) {
		const { data, error } = await supabase
			.from("challenges")
			.select("thumbnail_url, game_config")
			.range(offset, offset + limit - 1);

		if (error) {
			console.error("DB 조회 에러:", error.message);
			process.exit(1);
		}

		if (!data || data.length === 0) break;

		totalChallenges += data.length;

		for (const challenge of data) {
			// thumbnail
			if (challenge.thumbnail_url) {
				referencedPaths.add(challenge.thumbnail_url);
			}

			// game_config slots
			if (challenge.game_config) {
				for (const round of challenge.game_config) {
					if (!round.slots) continue;
					for (const slot of round.slots) {
						if (slot.imagePath) {
							referencedPaths.add(slot.imagePath);
						}
					}
				}
			}
		}

		if (data.length < limit) break;
		offset += limit;
	}

	console.log(`  챌린지 수: ${totalChallenges}개`);
	console.log(`  참조 중인 고유 이미지: ${referencedPaths.size}개`);

	return referencedPaths;
}

// --- Step 3: 고아 이미지 식별 ---

function findOrphanImages(r2Keys, referencedPaths) {
	const orphans = [];
	let orphanSize = 0;

	for (const { key, size } of r2Keys) {
		// _로 시작하는 테스트 파일은 건너뛰기
		if (key.startsWith("_")) continue;

		if (!referencedPaths.has(key)) {
			orphans.push({ key, size });
			orphanSize += size;
		}
	}

	return { orphans, orphanSize };
}

// --- Step 4: 고아 이미지 삭제 ---

async function deleteOrphanImages(orphans) {
	if (orphans.length === 0) {
		console.log("삭제할 고아 이미지가 없습니다.");
		return;
	}

	// S3 DeleteObjects는 한 번에 최대 1000개
	const batchSize = 1000;
	let deleted = 0;

	for (let i = 0; i < orphans.length; i += batchSize) {
		const batch = orphans.slice(i, i + batchSize);

		await r2.send(
			new DeleteObjectsCommand({
				Bucket: R2_BUCKET_NAME,
				Delete: {
					Objects: batch.map((o) => ({ Key: o.key })),
				},
			}),
		);

		deleted += batch.length;
		console.log(`  삭제 진행: ${deleted}/${orphans.length}`);
	}

	console.log(`  삭제 완료: ${deleted}개 파일`);
}

// --- Main ---

async function main() {
	console.log("=== 고아 이미지 정리 스크립트 ===");
	console.log(`모드: ${isDryRun ? "🔍 DRY RUN (삭제 안 함)" : "🗑️  DELETE (실제 삭제)"}`);
	console.log("");

	// 1. R2 파일 목록
	const { keys: r2Keys, totalSize } = await listAllR2Objects();
	console.log("");

	// 2. DB 참조 경로
	const referencedPaths = await getReferencedPaths();
	console.log("");

	// 3. 고아 식별
	const { orphans, orphanSize } = findOrphanImages(r2Keys, referencedPaths);

	console.log("=== 분석 결과 ===");
	console.log(`  R2 전체 파일: ${r2Keys.length}개 (${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB)`);
	console.log(`  DB 참조 이미지: ${referencedPaths.size}개`);
	console.log(`  고아 이미지: ${orphans.length}개 (${(orphanSize / 1024 / 1024).toFixed(1)} MB)`);
	console.log(
		`  정리 후 예상 용량: ${((totalSize - orphanSize) / 1024 / 1024 / 1024).toFixed(2)} GB`,
	);
	console.log("");

	if (orphans.length === 0) {
		console.log("고아 이미지가 없습니다. 정리가 필요하지 않습니다.");
		return;
	}

	// 상위 10개 고아 이미지 미리보기
	if (orphans.length > 0) {
		console.log(`고아 이미지 미리보기 (상위 ${Math.min(10, orphans.length)}개):`);
		for (const o of orphans.slice(0, 10)) {
			console.log(`  - ${o.key} (${(o.size / 1024).toFixed(0)} KB)`);
		}
		if (orphans.length > 10) {
			console.log(`  ... 외 ${orphans.length - 10}개`);
		}
		console.log("");
	}

	// 4. 삭제
	if (isDryRun) {
		console.log("💡 실제 삭제하려면 --delete 플래그를 추가하세요:");
		console.log("   node scripts/cleanup-orphan-images.mjs --delete");
	} else {
		console.log("삭제를 시작합니다...");
		await deleteOrphanImages(orphans);
		console.log(
			`\n✅ 완료! ${(orphanSize / 1024 / 1024).toFixed(1)} MB를 확보했습니다.`,
		);
	}
}

main().catch((err) => {
	console.error("스크립트 실행 실패:", err);
	process.exit(1);
});
