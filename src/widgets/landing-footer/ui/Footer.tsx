import { ClipboardList, Github } from "lucide-react";
import Link from "next/link";

const socialLinks = [
	{
		icon: Github,
		label: "GitHub",
		href: "https://github.com/Yoon-Hae-Min/say_the_word_on_beat_kr",
	},
	{
		icon: ClipboardList,
		label: "설문조사",
		href: "https://forms.gle/DvEFwiHwYuBP2b569",
	},
];

export default function Footer() {
	return (
		<footer className="border-t border-chalk-white/10 px-4 py-8">
			<div className="mx-auto max-w-6xl">
				{/* Social media icons */}
				<div className="mb-6 flex justify-center gap-6">
					{socialLinks.map((link) => (
						<a
							key={link.label}
							href={link.href}
							aria-label={link.label}
							className="text-chalk-white transition-all hover:scale-110 hover:text-chalk-yellow hover-wiggle"
						>
							<link.icon size={28} />
						</a>
					))}
				</div>

				{/* Site Links */}
				<div className="mb-4 flex flex-wrap justify-center gap-4 text-sm">
					<Link
						href="/guide"
						className="text-chalk-white/70 underline transition-colors hover:text-chalk-yellow"
					>
						게임 가이드
					</Link>
					<Link
						href="/faq"
						className="text-chalk-white/70 underline transition-colors hover:text-chalk-yellow"
					>
						자주 묻는 질문
					</Link>
					<Link
						href="/about"
						className="text-chalk-white/70 underline transition-colors hover:text-chalk-yellow"
					>
						소개
					</Link>
					<Link
						href="/privacy"
						className="text-chalk-white/70 underline transition-colors hover:text-chalk-yellow"
					>
						개인정보 처리방침
					</Link>
				</div>

				{/* Copyright text */}
				<p className="chalk-text text-center text-sm text-chalk-white/70">
					© 2026 단어리듬게임. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
