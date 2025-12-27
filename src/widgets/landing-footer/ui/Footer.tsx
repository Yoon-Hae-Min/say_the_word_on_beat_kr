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
		<footer className="border-t-4 border-chalk-white/30 px-4 py-8">
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

				{/* Privacy Policy Link */}
				<div className="mb-4 text-center">
					<Link
						href="/privacy"
						className="text-chalk-white/70 hover:text-chalk-yellow transition-colors text-sm underline"
					>
						개인정보 처리방침
					</Link>
				</div>

				{/* Copyright text */}
				<p className="chalk-text text-center text-sm text-chalk-white/70">
					© 2025 단어리듬게임. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
