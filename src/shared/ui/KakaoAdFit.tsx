"use client";

import { useEffect, useRef, useState } from "react";

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
	const [isVisible, setIsVisible] = useState(false);

	// Intersection Observer: 뷰포트 근처에 올 때 isVisible 설정
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px" }
		);

		observer.observe(container);
		return () => observer.disconnect();
	}, []);

	// 실제 광고 스크립트 로드
	useEffect(() => {
		if (!isVisible) return;
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
	}, [isVisible, adUnitId]);

	return (
		<div
			ref={containerRef}
			className={`flex justify-center ${className}`}
			style={{ minHeight: adHeight }}
		>
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
