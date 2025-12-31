"use client";

import { useEffect } from "react";
import { getUserId } from "@/shared/lib/user/fingerprint";

/**
 * 앱 시작 시 userId를 무조건 생성하는 초기화 컴포넌트
 * - 다른 컴포넌트보다 먼저 실행되어 userId가 준비되도록 보장
 * - 렌더링하지 않음 (순수 side-effect 컴포넌트)
 */
export default function UserInitializer() {
	useEffect(() => {
		// 앱 시작 시 userId 초기화
		getUserId();
	}, []);

	return null;
}
