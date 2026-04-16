"use client";

import { useEffect, useRef, useState } from "react";
import NoticeModal from "./NoticeModal";
import { type Notice, notices } from "./notices";

const STORAGE_PREFIX = "notice:";
const DISMISSED = -1;

function readCount(id: string): number | null {
	try {
		const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${id}`);
		if (raw === null) return 0;
		const parsed = Number.parseInt(raw, 10);
		return Number.isNaN(parsed) ? 0 : parsed;
	} catch {
		return null;
	}
}

function writeCount(id: string, value: number): void {
	try {
		window.localStorage.setItem(`${STORAGE_PREFIX}${id}`, String(value));
	} catch {
		// 저장 실패는 무시 — 세션 내에서는 정상 동작
	}
}

function selectActiveNotice(): Notice | null {
	const now = Date.now();
	const active = notices
		.filter((n) => Date.parse(n.expiresAt) > now)
		.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

	for (const notice of active) {
		const count = readCount(notice.id);
		if (count === null) return null;
		if (count === DISMISSED) continue;
		if (count >= notice.maxViews) continue;
		return notice;
	}
	return null;
}

export default function NoticeRoot() {
	const [current, setCurrent] = useState<Notice | null>(null);
	// Strict Mode 이중 실행 시 카운트가 두 번 증가하지 않도록 guard
	const countedIds = useRef<Set<string>>(new Set());

	useEffect(() => {
		const notice = selectActiveNotice();
		if (!notice) return;

		if (!countedIds.current.has(notice.id)) {
			countedIds.current.add(notice.id);
			const count = readCount(notice.id) ?? 0;
			writeCount(notice.id, count + 1);
		}

		setCurrent(notice);
	}, []);

	const handleClose = () => {
		if (!current) return;
		writeCount(current.id, DISMISSED);
		setCurrent(null);
	};

	if (!current) return null;

	return (
		<NoticeModal
			titleId={`notice-title-${current.id}`}
			title={current.title}
			message={current.message}
			onClose={handleClose}
		/>
	);
}
