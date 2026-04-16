import type { ReactNode } from "react";

export interface Notice {
	/** 고유 식별자. localStorage 키로 사용되므로 변경 시 노출 이력 초기화됨. */
	id: string;
	title: string;
	message: ReactNode;
	/** 자동 노출 최대 횟수. 이 값에 도달하면 더 이상 띄우지 않음. */
	maxViews: number;
	/** 만료 시각 (ISO 8601, timezone 포함 권장). 이후 자동 미노출. */
	expiresAt: string;
	/** 동시 활성 공지가 여럿일 때 높은 값이 먼저 노출. 기본 0. */
	priority?: number;
}

export const notices: Notice[] = [
	{
		id: "upload-fix-2026-04-17",
		title: "공지",
		message: (
			<>
				이미지 업로드 오류가 해결되었습니다.
				<br />
				이용에 불편을 드려 죄송합니다. 다시 시도해 주세요!
			</>
		),
		maxViews: 2,
		expiresAt: "2026-04-24T00:00:00+09:00",
		priority: 1,
	},
];
