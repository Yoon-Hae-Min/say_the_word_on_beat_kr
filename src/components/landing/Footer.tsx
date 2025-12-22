import { Github, Mail, Twitter, Youtube } from "lucide-react";

const socialLinks = [
	{ icon: Github, label: "GitHub", href: "#" },
	{ icon: Twitter, label: "Twitter", href: "#" },
	{ icon: Youtube, label: "YouTube", href: "#" },
	{ icon: Mail, label: "Email", href: "#" },
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

				{/* Copyright text */}
				<p className="chalk-text text-center text-sm text-chalk-white/70">
					© 2025 단어리듬게임. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
