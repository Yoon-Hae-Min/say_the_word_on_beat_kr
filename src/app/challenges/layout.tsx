import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "모든 챌린지 - 단어리듬게임",
	description:
		"커뮤니티가 만든 다양한 Say The Word On Beat 챌린지를 탐색하고 플레이하세요. 인기 순, 최신 순으로 정렬 가능합니다.",
	openGraph: {
		title: "모든 챌린지 - 단어리듬게임",
		description: "커뮤니티가 만든 다양한 Say The Word On Beat 챌린지를 탐색하고 플레이하세요.",
		url: "https://say-the-word-on-beat.vercel.app/challenges",
	},
	alternates: {
		canonical: "https://say-the-word-on-beat.vercel.app/challenges",
	},
};

export default function ChallengesLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
