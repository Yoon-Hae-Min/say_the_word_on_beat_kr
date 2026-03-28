import type { Metadata } from "next";
import Link from "next/link";
import { WoodFrame } from "@/shared/ui";

export const metadata: Metadata = {
	title: "게임 가이드 - 단어리듬게임",
	description:
		"단어리듬게임의 규칙과 플레이 방법을 알아보세요. 5라운드 8비트 리듬 퀴즈 챌린지를 만들고 친구와 공유하는 방법을 설명합니다.",
	openGraph: {
		title: "게임 가이드 - 단어리듬게임",
		description: "단어리듬게임의 규칙과 플레이 방법을 알아보세요.",
		type: "website",
		siteName: "단어리듬게임",
	},
};

export default function GuidePage() {
	return (
		<WoodFrame>
			<main className="bg-chalkboard-bg px-4 py-12 md:py-16">
				<article className="mx-auto max-w-3xl">
					<h1 className="chalk-text mb-10 text-center text-3xl font-bold text-chalk-yellow md:text-4xl">
						게임 가이드
					</h1>

					{/* 단어리듬게임이란 */}
					<section className="mb-10">
						<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-white">
							단어리듬게임이란?
						</h2>
						<p className="mb-3 leading-relaxed text-chalk-white/90">
							단어리듬게임은 화면에 나타나는 이미지를 보고, 박자에 맞춰 해당 항목의 이름을 말하는
							리듬 퀴즈 게임입니다. SNS에서 유행하는 &quot;Say The Word On Beat&quot; 챌린지를
							웹에서 직접 만들고 플레이할 수 있습니다.
						</p>
						<p className="leading-relaxed text-chalk-white/90">
							누구나 자신만의 챌린지를 만들 수 있고, 링크 하나로 친구에게 공유할 수 있습니다.
							회원가입이나 앱 설치 없이 브라우저에서 바로 이용할 수 있습니다.
						</p>
					</section>

					{/* 게임 규칙 */}
					<section className="mb-10">
						<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-white">게임 규칙</h2>
						<div className="rounded-lg border-2 border-chalk-white/20 bg-chalkboard-bg/60 p-5">
							<ul className="space-y-3 text-chalk-white/90">
								<li className="flex gap-2">
									<span className="font-bold text-chalk-yellow">1.</span>
									<span>
										한 게임은 총 <strong className="text-chalk-yellow">5라운드</strong>로
										구성됩니다.
									</span>
								</li>
								<li className="flex gap-2">
									<span className="font-bold text-chalk-yellow">2.</span>
									<span>
										각 라운드에는 <strong className="text-chalk-yellow">8개의 슬롯</strong>이
										있습니다. 각 슬롯에는 이미지가 배치되어 있습니다.
									</span>
								</li>
								<li className="flex gap-2">
									<span className="font-bold text-chalk-yellow">3.</span>
									<span>
										음악이 재생되면 비트에 맞춰 슬롯이 하나씩 강조 표시됩니다. 강조된 슬롯의
										이미지를 보고 해당 항목의 이름을 박자에 맞춰 말하면 됩니다.
									</span>
								</li>
								<li className="flex gap-2">
									<span className="font-bold text-chalk-yellow">4.</span>
									<span>5라운드를 모두 마치면 게임이 끝나고, 난이도를 투표할 수 있습니다.</span>
								</li>
							</ul>
						</div>
					</section>

					{/* 플레이 방법 */}
					<section className="mb-10">
						<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-white">플레이 방법</h2>
						<div className="space-y-4 text-chalk-white/90">
							<div className="rounded-lg border border-chalk-white/10 bg-chalkboard-bg/40 p-4">
								<h3 className="mb-2 font-bold text-chalk-blue">게임 시작</h3>
								<p>
									챌린지 페이지에 들어가면 제목과 난이도 정보가 표시됩니다. &quot;시작하기&quot;
									버튼을 누르면 3초 카운트다운이 시작됩니다.
								</p>
							</div>
							<div className="rounded-lg border border-chalk-white/10 bg-chalkboard-bg/40 p-4">
								<h3 className="mb-2 font-bold text-chalk-blue">플레이</h3>
								<p>
									카운트다운이 끝나면 음악과 함께 게임이 시작됩니다. 4열 2행으로 배치된 8개 슬롯 중
									노란색 테두리로 강조된 슬롯의 이미지를 확인하고, 리듬에 맞춰 해당 항목의 이름을
									말하세요.
								</p>
							</div>
							<div className="rounded-lg border border-chalk-white/10 bg-chalkboard-bg/40 p-4">
								<h3 className="mb-2 font-bold text-chalk-blue">게임 완료</h3>
								<p>
									5라운드를 모두 마치면 결과 화면이 나타납니다. 난이도를 투표하거나, 처음부터 다시
									하거나, 다른 사람에게 공유할 수 있습니다.
								</p>
							</div>
						</div>
					</section>

					{/* 챌린지 만들기 */}
					<section className="mb-10">
						<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-white">챌린지 만들기</h2>
						<p className="mb-4 leading-relaxed text-chalk-white/90">
							직접 챌린지를 만들어 친구들에게 공유할 수 있습니다. 만드는 과정은 간단합니다.
						</p>
						<ol className="space-y-3 text-chalk-white/90">
							<li className="flex gap-2">
								<span className="font-bold text-chalk-yellow">1.</span>
								<span>
									이미지를 업로드합니다. 파일 선택이나 클립보드 붙여넣기로 이미지를 추가할 수
									있습니다. 이미지는 자동으로 압축됩니다.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="font-bold text-chalk-yellow">2.</span>
								<span>
									각 이미지에 이름을 지정합니다. 이 이름은 플레이 중 화면에 표시할 수 있습니다.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="font-bold text-chalk-yellow">3.</span>
								<span>
									5개 라운드의 8개 슬롯에 이미지를 배치합니다. 최소 3개 이상의 서로 다른 이미지를
									사용해야 합니다.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="font-bold text-chalk-yellow">4.</span>
								<span>
									&quot;이름 표시&quot; 옵션을 켜면 플레이 중 이미지 아래에 이름이 표시됩니다.
									힌트가 필요한 챌린지에 유용합니다.
								</span>
							</li>
							<li className="flex gap-2">
								<span className="font-bold text-chalk-yellow">5.</span>
								<span>완성되면 공개 또는 비공개로 챌린지를 생성할 수 있습니다.</span>
							</li>
						</ol>
					</section>

					{/* 난이도 투표 */}
					<section className="mb-10">
						<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-white">난이도 투표</h2>
						<p className="mb-3 leading-relaxed text-chalk-white/90">
							게임을 완료하면 해당 챌린지의 난이도를 투표할 수 있습니다. 쉬움, 보통, 어려움 중
							하나를 선택하면 됩니다. 투표 결과는 챌린지 시작 화면에 표시되어 다른 플레이어가
							난이도를 미리 확인할 수 있습니다.
						</p>
						<p className="leading-relaxed text-chalk-white/90">
							투표는 한 번만 할 수 있지만, 나중에 마음이 바뀌면 변경할 수도 있습니다.
						</p>
					</section>

					{/* 팁 */}
					<section className="mb-10">
						<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-white">플레이 팁</h2>
						<div className="space-y-3 text-chalk-white/90">
							<div className="flex gap-3 rounded-lg border border-chalk-yellow/30 bg-chalk-yellow/5 p-4">
								<span className="text-lg text-chalk-yellow">💡</span>
								<p>
									처음 플레이할 때는 &quot;이름 표시&quot;가 켜진 챌린지부터 시작하면 익숙해지기
									좋습니다.
								</p>
							</div>
							<div className="flex gap-3 rounded-lg border border-chalk-yellow/30 bg-chalk-yellow/5 p-4">
								<span className="text-lg text-chalk-yellow">💡</span>
								<p>
									챌린지를 만들 때 비슷한 카테고리의 이미지를 사용하면 더 재미있는 퀴즈가 됩니다.
									예를 들어 과일, 동물, 연예인 등 하나의 주제로 통일해 보세요.
								</p>
							</div>
							<div className="flex gap-3 rounded-lg border border-chalk-yellow/30 bg-chalk-yellow/5 p-4">
								<span className="text-lg text-chalk-yellow">💡</span>
								<p>
									같은 이미지를 여러 슬롯에 반복 배치하면 난이도를 조절할 수 있습니다. 익숙한
									이미지가 자주 나오면 쉬워지고, 다양한 이미지가 번갈아 나오면 어려워집니다.
								</p>
							</div>
						</div>
					</section>

					{/* CTA */}
					<div className="text-center">
						<Link
							href="/challenges"
							className="chalk-text inline-block rounded-lg border-2 border-chalk-yellow bg-transparent px-8 py-3 text-lg text-chalk-yellow transition-all hover:bg-chalk-yellow hover:text-chalkboard-bg"
						>
							챌린지 둘러보기
						</Link>
					</div>
				</article>
			</main>
		</WoodFrame>
	);
}
