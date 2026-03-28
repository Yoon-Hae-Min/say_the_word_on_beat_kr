import type { Metadata } from "next";
import Link from "next/link";
import { WoodFrame } from "@/shared/ui";

export const metadata: Metadata = {
	title: "소개 - 단어리듬게임",
	description:
		"단어리듬게임은 누구나 쉽게 리듬 퀴즈 챌린지를 만들고 공유할 수 있는 웹 게임 플랫폼입니다. 로그인 없이 무료로 이용하세요.",
	openGraph: {
		title: "소개 - 단어리듬게임",
		description:
			"단어리듬게임은 누구나 쉽게 리듬 퀴즈 챌린지를 만들고 공유할 수 있는 웹 게임 플랫폼입니다.",
		type: "website",
		siteName: "단어리듬게임",
	},
};

const features = [
	{
		title: "로그인 없이 바로 시작",
		description:
			"회원가입이나 앱 설치 없이 브라우저에서 바로 챌린지를 만들고 플레이할 수 있습니다.",
	},
	{
		title: "누구나 만들 수 있는 챌린지",
		description:
			"이미지를 올리고 슬롯에 배치하면 끝. 어렵지 않게 나만의 리듬 퀴즈를 만들 수 있습니다.",
	},
	{
		title: "링크 하나로 공유",
		description:
			"만든 챌린지는 링크 하나로 친구에게 바로 보낼 수 있습니다. 카카오톡, 인스타그램, 어디든 공유 가능합니다.",
	},
	{
		title: "무료 이용",
		description: "모든 기능을 무료로 이용할 수 있습니다. 숨겨진 비용은 없습니다.",
	},
];

const targetUsers = [
	"친구들과 재미있는 퀴즈를 공유하고 싶은 분",
	"SNS에서 본 단어리듬 챌린지를 직접 만들어보고 싶은 분",
	"수업이나 모임에서 아이스브레이킹 게임이 필요한 분",
	"K-POP, 애니메이션, 음식 등 좋아하는 주제로 퀴즈를 만들고 싶은 분",
];

export default function AboutPage() {
	return (
		<WoodFrame>
			<main className="bg-chalkboard-bg px-4 py-12 md:py-16">
				<div className="mx-auto max-w-3xl">
					<h1 className="chalk-text mb-10 text-center text-3xl font-bold text-chalk-yellow md:text-4xl">
						단어리듬게임 소개
					</h1>

					{/* 서비스 소개 */}
					<section className="mb-10">
						<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-white">
							어떤 서비스인가요?
						</h2>
						<p className="mb-3 leading-relaxed text-chalk-white/90">
							단어리듬게임은 음악 비트에 맞춰 이미지의 이름을 말하는 리듬 퀴즈 게임입니다. SNS에서
							유행하고 있는 &quot;Say The Word On Beat&quot; 챌린지를 웹에서 직접 만들고 플레이할 수
							있도록 만든 플랫폼입니다.
						</p>
						<p className="leading-relaxed text-chalk-white/90">
							기존에는 영상 편집 프로그램을 사용해야만 이런 챌린지를 만들 수 있었습니다.
							단어리듬게임에서는 이미지만 올리면 누구나 쉽게 챌린지를 만들 수 있고, 만든 챌린지를
							링크 하나로 공유할 수 있습니다.
						</p>
					</section>

					{/* 특징 */}
					<section className="mb-10">
						<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-white">특징</h2>
						<div className="grid gap-4 md:grid-cols-2">
							{features.map((feature) => (
								<div
									key={feature.title}
									className="rounded-lg border-2 border-chalk-white/20 bg-chalkboard-bg/60 p-5"
								>
									<h3 className="chalk-text mb-2 font-bold text-chalk-yellow">{feature.title}</h3>
									<p className="text-sm leading-relaxed text-chalk-white/85">
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</section>

					{/* 이런 분들에게 추천 */}
					<section className="mb-10">
						<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-white">
							이런 분들에게 추천합니다
						</h2>
						<ul className="space-y-2">
							{targetUsers.map((user) => (
								<li key={user} className="flex gap-3 text-chalk-white/90">
									<span className="text-chalk-yellow">•</span>
									<span>{user}</span>
								</li>
							))}
						</ul>
					</section>

					{/* 만든 이유 */}
					<section className="mb-10">
						<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-white">왜 만들었나요?</h2>
						<p className="leading-relaxed text-chalk-white/90">
							인스타그램이나 틱톡에서 단어리듬 챌린지 영상을 보면 재미있어 보이는데, 실제로 만들려면
							영상 편집 프로그램이 필요해서 진입 장벽이 높았습니다. 이미지 몇 장만 올리면 누구나
							챌린지를 만들 수 있으면 좋겠다고 생각했고, 그래서 이 서비스를 만들게 되었습니다.
						</p>
					</section>

					{/* CTA */}
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
						<Link
							href="/challenges"
							className="chalk-text inline-block rounded-lg border-2 border-chalk-yellow bg-transparent px-8 py-3 text-lg text-chalk-yellow transition-all hover:bg-chalk-yellow hover:text-chalkboard-bg"
						>
							챌린지 둘러보기
						</Link>
						<Link
							href="/guide"
							className="chalk-text inline-block rounded-lg border-2 border-chalk-white/50 bg-transparent px-8 py-3 text-lg text-chalk-white transition-all hover:bg-chalk-white/10"
						>
							가이드 보기
						</Link>
					</div>
				</div>
			</main>
		</WoodFrame>
	);
}
