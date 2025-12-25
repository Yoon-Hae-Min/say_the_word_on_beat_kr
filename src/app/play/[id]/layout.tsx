import { Metadata } from "next";
import { getChallengeById } from "@/features/game-play/api/challengeService";

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
		const thumbnail = challengeData.thumbnail_url || "/placeholder.svg";

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

export default function PlayLayout({ children }: PlayLayoutProps) {
	return <>{children}</>;
}
