export function WebSiteJsonLd() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "단어리듬게임 - Say The Word On Beat",
		description:
			"웹에서 누구나 쉽게 'Say The Word On Beat' 챌린지를 만들고 공유하는 리듬 퀴즈 플랫폼",
		url: "https://say-the-word-on-beat.vercel.app",
		potentialAction: {
			"@type": "SearchAction",
			target: "https://say-the-word-on-beat.vercel.app/challenges?q={search_term_string}",
			"query-input": "required name=search_term_string",
		},
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Schema.org JSON-LD requires this
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}

interface GameJsonLdProps {
	challenge: {
		id: string;
		title: string;
		viewCount: number;
		createdAt: string;
	};
}

// Sanitize user-provided strings to prevent script injection in JSON-LD context
function sanitizeForJsonLd(str: string): string {
	return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");
}

export function GameJsonLd({ challenge }: GameJsonLdProps) {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Game",
		name: sanitizeForJsonLd(challenge.title),
		url: `https://say-the-word-on-beat.vercel.app/play/${encodeURIComponent(challenge.id)}`,
		gamePlatform: "Web Browser",
		genre: "Rhythm Game",
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "5",
			reviewCount: challenge.viewCount,
		},
		datePublished: challenge.createdAt,
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Schema.org JSON-LD requires this
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}
