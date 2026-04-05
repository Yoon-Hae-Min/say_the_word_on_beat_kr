import type { Metadata } from "next";
import Link from "next/link";
import { WoodFrame } from "@/shared/ui";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "자주 묻는 질문 - 단어리듬게임",
	description:
		"단어리듬게임에 대해 자주 묻는 질문과 답변입니다. 게임 방법, 챌린지 만들기, 공유 방법 등을 확인하세요.",
	openGraph: {
		title: "자주 묻는 질문 - 단어리듬게임",
		description: "단어리듬게임에 대해 자주 묻는 질문과 답변입니다.",
		type: "website",
		siteName: "단어리듬게임",
	},
};

const faqs = [
	{
		question: "단어리듬게임이 뭔가요?",
		answer:
			'SNS에서 유행하는 "Say The Word On Beat" 챌린지를 웹에서 직접 만들고 플레이할 수 있는 리듬 퀴즈 게임입니다. 음악 비트에 맞춰 화면에 나타나는 이미지의 이름을 말하는 게임이에요.',
	},
	{
		question: "회원가입 없이 이용할 수 있나요?",
		answer:
			"네, 회원가입이나 로그인 없이 바로 이용할 수 있습니다. 챌린지를 만들거나, 플레이하거나, 난이도를 투표하는 모든 기능을 계정 없이 사용할 수 있습니다.",
	},
	{
		question: "챌린지는 어떻게 만드나요?",
		answer:
			'홈 화면에서 "나만의 단어리듬게임 만들기" 버튼을 누르세요. 이미지를 업로드하고, 각 이미지에 이름을 붙인 뒤, 5개 라운드의 8개 슬롯에 이미지를 배치하면 됩니다. 최소 3개 이상의 서로 다른 이미지가 필요합니다.',
	},
	{
		question: "이미지는 몇 개까지 올릴 수 있나요?",
		answer:
			"업로드할 수 있는 이미지 수에 제한은 없습니다. 다만 각 라운드에 8개의 슬롯이 있고, 5라운드이므로 총 40개의 슬롯에 이미지를 배치하게 됩니다. 같은 이미지를 여러 슬롯에 반복 배치할 수 있어서, 실제로 필요한 이미지는 최소 3개입니다.",
	},
	{
		question: "이름 표시 기능은 뭔가요?",
		answer:
			"챌린지를 만들 때 '이름 표시' 옵션을 켜면, 게임 중 강조된 슬롯 아래에 해당 이미지의 이름이 표시됩니다. 힌트를 제공하고 싶을 때 유용합니다. 끄면 이미지만 보이기 때문에 난이도가 올라갑니다.",
	},
	{
		question: "비공개 챌린지는 다른 사람이 볼 수 없나요?",
		answer:
			"비공개 챌린지는 챌린지 목록 페이지에 표시되지 않습니다. 하지만 링크를 직접 공유하면 누구나 플레이할 수 있습니다. 특정 사람에게만 공유하고 싶을 때 비공개로 설정하세요.",
	},
	{
		question: "난이도 투표는 어떻게 하나요?",
		answer:
			"게임을 끝까지 플레이하면 결과 화면에서 쉬움, 보통, 어려움 중 하나를 선택하여 투표할 수 있습니다. 투표 결과는 다른 사람이 게임을 시작할 때 참고할 수 있도록 표시됩니다. 투표는 나중에 변경할 수도 있습니다.",
	},
	{
		question: "내가 만든 챌린지를 삭제할 수 있나요?",
		answer:
			"네, 본인이 만든 챌린지의 플레이 화면에서 삭제 버튼을 눌러 삭제할 수 있습니다. 삭제하면 해당 챌린지와 관련된 투표 데이터도 함께 삭제되며, 복구할 수 없으니 주의하세요.",
	},
	{
		question: "모바일에서도 할 수 있나요?",
		answer:
			"네, 모바일 브라우저에서도 이용할 수 있습니다. 별도 앱 설치 없이 웹 브라우저에서 바로 접속하면 됩니다. 화면 크기에 맞게 자동으로 조정됩니다.",
	},
	{
		question: "챌린지를 공유하려면 어떻게 하나요?",
		answer:
			'게임 완료 화면에서 "공유하기" 버튼을 누르면 챌린지 링크를 카카오톡, 문자, SNS 등으로 공유할 수 있습니다. 링크를 받은 사람은 바로 해당 챌린지를 플레이할 수 있습니다.',
	},
];

export default function FaqPage() {
	return (
		<WoodFrame>
			<main className="bg-chalkboard-bg px-4 py-12 md:py-16">
				<div className="mx-auto max-w-3xl">
					<h1 className="chalk-text mb-10 text-center text-3xl font-bold text-chalk-yellow md:text-4xl">
						자주 묻는 질문
					</h1>

					<div className="space-y-3">
						{faqs.map((faq) => (
							<details
								key={faq.question}
								className="group rounded-lg border-2 border-chalk-white/20 bg-chalkboard-bg/60"
							>
								<summary className="flex cursor-pointer items-center justify-between p-5 text-chalk-white transition-colors hover:text-chalk-yellow">
									<span className="chalk-text pr-4 text-lg font-bold">{faq.question}</span>
									<span className="shrink-0 text-chalk-white/50 transition-transform group-open:rotate-180">
										▼
									</span>
								</summary>
								<div className="border-t border-chalk-white/10 px-5 pb-5 pt-4">
									<p className="leading-relaxed text-chalk-white/85">{faq.answer}</p>
								</div>
							</details>
						))}
					</div>

					<div className="mt-10 text-center">
						<Link
							href="/challenges"
							className="chalk-text inline-block rounded-lg border-2 border-chalk-yellow bg-transparent px-8 py-3 text-lg text-chalk-yellow transition-all hover:bg-chalk-yellow hover:text-chalkboard-bg"
						>
							챌린지 둘러보기
						</Link>
					</div>
				</div>
			</main>
		</WoodFrame>
	);
}
