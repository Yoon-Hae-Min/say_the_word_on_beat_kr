import { Mic, MousePointerClick, Play, Share2 } from "lucide-react";

const playSteps = [
	{
		id: "step1",
		icon: MousePointerClick,
		label: "챌린지 선택",
		color: "text-chalk-yellow",
	},
	{
		id: "step2",
		icon: Play,
		label: "시작하기",
		color: "text-chalk-white",
	},
	{
		id: "step3",
		icon: Mic,
		label: "비트에 맞춰 말하기",
		color: "text-chalk-blue",
	},
	{
		id: "step4",
		icon: Share2,
		label: "친구에게 공유",
		color: "text-chalk-yellow",
	},
];

export default function FeatureShowcase() {
	return (
		<section className="px-4 py-36 md:py-44">
			<div className="mx-auto max-w-6xl">
				<h2 className="chalk-text mb-14 text-center text-2xl font-bold text-chalk-white md:text-3xl">
					플레이 방법
				</h2>

				<div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
					{playSteps.map((step) => (
						<div
							key={step.id}
							className="flex flex-col items-center rounded-lg bg-chalk-white/5 px-4 py-10 text-center md:py-12"
						>
							<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-chalk-white/10">
								<step.icon className={step.color} size={40} />
							</div>
							<p className="chalk-text text-base font-bold text-chalk-white md:text-lg">
								{step.label}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
