import type { Metadata } from "next";
import { Gamja_Flower, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LocationJsProvider from "@/shared/provider/LocationJsProvider";
import GoogleAnalytics from "@/shared/components/GoogleAnalytics";

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
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gamjaFlower.variable} antialiased`}
      >
        <LocationJsProvider>{children}</LocationJsProvider>
      </body>
    </html>
  );
}
