"use client";

import { useEffect, useRef } from "react";

interface KakaoAdFitProps {
	adUnitId: string;
	adWidth: number;
	adHeight: number;
	className?: string;
}

export default function KakaoAdFit({
	adUnitId,
	adWidth,
	adHeight,
	className = "",
}: KakaoAdFitProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const isLoadedRef = useRef(false);

	useEffect(() => {
		if (isLoadedRef.current) return;
		if (!containerRef.current) return;

		const script = document.createElement("script");
		script.async = true;
		script.type = "text/javascript";
		script.src = "https://t1.daumcdn.net/kas/static/ba.min.js";

		containerRef.current.appendChild(script);
		isLoadedRef.current = true;

		return () => {
			const container = containerRef.current;
			if (!container) return;

			const scripts = container.querySelectorAll("script");
			scripts.forEach((s) => s.remove());

			const ins = container.querySelector("ins");
			if (ins) {
				ins.innerHTML = "";
			}
		};
	}, [adUnitId]);

	return (
		<div ref={containerRef} className={`flex justify-center ${className}`}>
			<ins
				className="kakao_ad_area"
				style={{ display: "none", width: "100%" }}
				data-ad-unit={adUnitId}
				data-ad-width={String(adWidth)}
				data-ad-height={String(adHeight)}
			/>
		</div>
	);
}
