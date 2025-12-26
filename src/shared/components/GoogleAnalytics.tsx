"use client";

import Script from "next/script";
import { useEffect } from "react";
import { getUserId } from "@/shared/lib/user/fingerprint";
import { setGAUserId } from "@/shared/lib/analytics/gtag";

export default function GoogleAnalytics() {
	const GA_ID = "G-XR0CC6JPB7";

	useEffect(() => {
		// GA 로드 후 사용자 ID 설정
		const userId = getUserId();
		setGAUserId(userId);
	}, []);

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${GA_ID}');
				`}
			</Script>
		</>
	);
}
