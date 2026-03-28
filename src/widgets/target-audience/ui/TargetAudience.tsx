import type { LucideIcon } from "lucide-react";
import { Link2, PartyPopper, Sparkles, Tv } from "lucide-react";

interface AudienceItem {
	icon: LucideIcon;
	text: string;
	color: string;
}

const audiences: AudienceItem[] = [
	{ icon: Link2, text: "친구한테 퀴즈 보내고 싶은 분", color: "text-chalk-yellow" },
	{ icon: Tv, text: "SNS 챌린지가 궁금했던 분", color: "text-chalk-blue" },
	{ icon: PartyPopper, text: "모임 아이스브레이킹이 필요한 분", color: "text-chalk-white" },
	{ icon: Sparkles, text: "덕질 퀴즈를 만들고 싶은 분", color: "text-chalk-yellow" },
];

export default function TargetAudience() {
	return (
		<section className="px-4 py-36 md:py-44">
			<div className="mx-auto max-w-6xl">
				<h2 className="chalk-text mb-14 text-center text-2xl font-bold text-chalk-white md:text-3xl">
					이런 분들에게 딱 맞아요
				</h2>

				<div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
					{audiences.map((item) => (
						<div
							key={item.text}
							className="flex flex-col items-center gap-5 rounded-lg bg-chalk-white/5 px-4 py-10 text-center md:py-12"
						>
							<div className="flex h-20 w-20 items-center justify-center rounded-full bg-chalk-white/10">
								<item.icon className={item.color} size={40} />
							</div>
							<p className="chalk-text text-base font-bold text-chalk-white/80 md:text-lg">
								{item.text}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
