import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Gamja_Flower, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/shared/components/GoogleAnalytics";
import { WebSiteJsonLd } from "@/shared/components/JsonLd";
import UserInitializer from "@/shared/components/UserInitializer";
import LocationJsProvider from "@/shared/provider/LocationJsProvider";
import QueryProvider from "@/shared/provider/QueryProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const gamjaFlower = Gamja_Flower({
	weight: "400",
	variable: "--font-hand",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "단어리듬게임 - Say The Word On Beat",
	description:
		"웹에서 누구나 쉽게 'Say The Word On Beat' 챌린지를 만들고 공유하는 리듬 퀴즈 플랫폼",
	keywords: ["리듬게임", "단어게임", "퀴즈", "챌린지"],
	openGraph: {
		type: "website",
		locale: "ko_KR",
		url: "https://say-the-word-on-beat.vercel.app",
		siteName: "단어리듬게임",
		title: "단어리듬게임 - Say The Word On Beat",
		description:
			"웹에서 누구나 쉽게 'Say The Word On Beat' 챌린지를 만들고 공유하는 리듬 퀴즈 플랫폼",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "단어리듬게임 - Say The Word On Beat",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "단어리듬게임 - Say The Word On Beat",
		description:
			"웹에서 누구나 쉽게 'Say The Word On Beat' 챌린지를 만들고 공유하는 리듬 퀴즈 플랫폼",
		images: ["/og-image.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<head>
				<meta name="google-adsense-account" content="ca-pub-2140562646099975" />
				<meta
					name="google-site-verification"
					content="oa97uVFj-uHbLA1T9v7vXrJP2N0fMyvjyorWnjtjTmQ"
				/>
				<UserInitializer />
				<GoogleAnalytics />
				<WebSiteJsonLd />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${gamjaFlower.variable} antialiased`}
			>
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-chalk-yellow focus:text-chalkboard-bg focus:px-4 focus:py-2 focus:rounded"
				>
					메인 콘텐츠로 건너뛰기
				</a>
				<QueryProvider>
					<LocationJsProvider>{children}</LocationJsProvider>
					<SpeedInsights />
				</QueryProvider>
			</body>
		</html>
	);
}
