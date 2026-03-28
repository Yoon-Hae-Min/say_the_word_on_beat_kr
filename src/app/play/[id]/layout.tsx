import type { Metadata } from "next";
import { getChallengeById } from "@/features/game-play";
import { GameJsonLd } from "@/shared/components/JsonLd";

interface PlayLayoutProps {
	children: React.ReactNode;
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id: challengeId } = await params;

	try {
		const challengeData = await getChallengeById(challengeId);

		if (!challengeData) {
			return {
				title: "챌린지를 찾을 수 없습니다 - 단어리듬게임",
				description: "요청하신 챌린지를 찾을 수 없습니다.",
			};
		}

		const title = `${challengeData.title} - 단어리듬게임`;
		const description = `${challengeData.title} 챌린지를 플레이해보세요! Say The Word On Beat 리듬 퀴즈 게임`;

		// Convert thumbnail_url (storage path) to public URL using R2
		let thumbnail = "/placeholder.svg";
		if (challengeData.thumbnail_url) {
			const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
			if (r2PublicUrl) {
				thumbnail = `${r2PublicUrl}/${challengeData.thumbnail_url}`;
			}
		}

		return {
			title,
			description,
			openGraph: {
				title,
				description,
				images: [
					{
						url: thumbnail,
						width: 1200,
						height: 630,
						alt: challengeData.title,
					},
				],
				type: "website",
				siteName: "단어리듬게임",
			},
			twitter: {
				card: "summary_large_image",
				title,
				description,
				images: [thumbnail],
			},
		};
	} catch (error) {
		console.error("Error generating metadata:", error);
		return {
			title: "단어리듬게임",
			description:
				"웹에서 누구나 쉽게 'Say The Word On Beat' 챌린지를 만들고 공유하는 리듬 퀴즈 플랫폼",
		};
	}
}

export default async function PlayLayout({ children, params }: PlayLayoutProps) {
	const { id: challengeId } = await params;

	let challengeInfo: {
		title: string;
		id: string;
		viewCount: number;
		createdAt: string;
		totalRounds: number;
		slotsPerRound: number;
		difficultyEasy: number;
		difficultyNormal: number;
		difficultyHard: number;
	} | null = null;

	try {
		const data = await getChallengeById(challengeId);
		if (data) {
			challengeInfo = {
				title: data.title,
				id: data.id,
				viewCount: Number(data.view_count) || 0,
				createdAt: data.created_at,
				totalRounds: data.game_config?.length ?? 5,
				slotsPerRound: data.game_config?.[0]?.slots?.length ?? 8,
				difficultyEasy: data.difficulty_easy ?? 0,
				difficultyNormal: data.difficulty_normal ?? 0,
				difficultyHard: data.difficulty_hard ?? 0,
			};
		}
	} catch {
		// 데이터 조회 실패 시 SSR 텍스트 없이 렌더링
	}

	const totalVotes = challengeInfo
		? challengeInfo.difficultyEasy + challengeInfo.difficultyNormal + challengeInfo.difficultyHard
		: 0;

	return (
		<>
			{/* SSR 텍스트 콘텐츠 — 크롤러가 읽을 수 있는 구조화된 정보 */}
			{challengeInfo && (
				<>
					<GameJsonLd
						challenge={{
							id: challengeInfo.id,
							title: challengeInfo.title,
							viewCount: challengeInfo.viewCount,
							createdAt: challengeInfo.createdAt,
						}}
					/>
					<div className="sr-only">
						<h1>{challengeInfo.title} - 단어리듬게임 챌린지</h1>
						<p>
							{challengeInfo.title} 챌린지를 플레이해보세요. 비트에 맞춰 이미지의 이름을
							말하는 리듬 퀴즈 게임입니다.
						</p>
						<p>
							이 챌린지는 {challengeInfo.totalRounds}라운드로 구성되어 있으며, 각 라운드에{" "}
							{challengeInfo.slotsPerRound}개의 슬롯이 있습니다.
						</p>
						{totalVotes > 0 && (
							<p>
								난이도 투표: 쉬움 {challengeInfo.difficultyEasy}표, 보통{" "}
								{challengeInfo.difficultyNormal}표, 어려움 {challengeInfo.difficultyHard}표
								(총 {totalVotes}명 참여)
							</p>
						)}
						<p>조회수: {challengeInfo.viewCount.toLocaleString()}회</p>
					</div>
				</>
			)}
			{children}
		</>
	);
}
