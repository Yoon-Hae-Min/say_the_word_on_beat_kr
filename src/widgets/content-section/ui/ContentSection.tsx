import Link from "next/link";

export default function ContentSection() {
	return (
		<section className="px-4 py-16">
			<div className="mx-auto max-w-6xl space-y-12">
				{/* 소개 텍스트 */}
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-white md:text-3xl">
						단어리듬게임이란?
					</h2>
					<p className="mb-3 leading-relaxed text-chalk-white/85">
						단어리듬게임은 비트에 맞춰 이미지의 이름을 말하는 리듬 퀴즈 게임입니다. 인스타그램이나
						틱톡에서 유행하는 &quot;Say The Word On Beat&quot; 챌린지를 누구나 웹에서 직접 만들고
						공유할 수 있습니다.
					</p>
					<p className="leading-relaxed text-chalk-white/85">
						영상 편집 없이 이미지만 올리면 챌린지가 완성됩니다. 5라운드 8비트로 구성된 게임을 만들어
						친구에게 링크 하나로 보내보세요. 회원가입도 앱 설치도 필요 없습니다.
					</p>
				</div>

				{/* 추천 대상 */}
				<div className="chalk-border border-chalk-white bg-chalkboard-bg/80 p-8 organic-rotate-1">
					<h2 className="chalk-text mb-6 text-center text-2xl font-bold text-chalk-yellow">
						이런 분들에게 딱 맞아요
					</h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{[
							{ text: "친구한테 퀴즈 보내고 싶은 분", sub: "만들고 링크만 보내면 끝" },
							{ text: "SNS 챌린지가 궁금했던 분", sub: "영상 편집 없이 바로 만들기" },
							{
								text: "모임에서 아이스브레이킹이 필요한 분",
								sub: "다 같이 화면 보고 플레이",
							},
							{ text: "덕질 퀴즈를 만들고 싶은 분", sub: "아이돌, 애니, 음식 뭐든 가능" },
						].map((item) => (
							<div
								key={item.text}
								className="rounded-md border border-chalk-white/20 bg-chalkboard-bg/50 p-4 text-center"
							>
								<p className="chalk-text text-sm font-bold text-chalk-white md:text-base">
									{item.text}
								</p>
								<p className="mt-1 text-xs text-chalk-white/60">{item.sub}</p>
							</div>
						))}
					</div>
				</div>

				{/* 더 알아보기 링크 */}
				<div className="flex flex-wrap justify-center gap-4">
					<Link
						href="/guide"
						className="text-chalk-blue underline transition-colors hover:text-chalk-yellow"
					>
						게임 가이드 보기
					</Link>
					<span className="text-chalk-white/30">|</span>
					<Link
						href="/faq"
						className="text-chalk-blue underline transition-colors hover:text-chalk-yellow"
					>
						자주 묻는 질문
					</Link>
					<span className="text-chalk-white/30">|</span>
					<Link
						href="/about"
						className="text-chalk-blue underline transition-colors hover:text-chalk-yellow"
					>
						서비스 소개
					</Link>
				</div>
			</div>
		</section>
	);
}
