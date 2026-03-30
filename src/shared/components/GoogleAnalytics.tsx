"use client";

import Script from "next/script";
import { useEffect } from "react";
import { setGAUserId } from "@/shared/lib/analytics/gtag";
import { captureTrafficSource } from "@/shared/lib/analytics/trafficSource";
import { getUserId } from "@/shared/lib/user/fingerprint";

export default function GoogleAnalytics() {
	const GA_ID = "G-XR0CC6JPB7";

	useEffect(() => {
		// GA 로드 후 사용자 ID 설정 및 트래픽 소스 캡처
		const userId = getUserId();
		setGAUserId(userId);
		captureTrafficSource();
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
