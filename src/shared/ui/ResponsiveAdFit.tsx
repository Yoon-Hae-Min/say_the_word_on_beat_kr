"use client";

import KakaoAdFit from "./KakaoAdFit";

interface ResponsiveAdFitProps {
	className?: string;
}

export default function ResponsiveAdFit({ className = "" }: ResponsiveAdFitProps) {
	return (
		<div className={className}>
			{/* 모바일: 300x250 */}
			<div className="block md:hidden">
				<KakaoAdFit adUnitId="DAN-Noc2RA0ZdYc86jtI" adWidth={300} adHeight={250} />
			</div>

			{/* 데스크톱: 728x90 */}
			<div className="hidden md:block">
				<KakaoAdFit adUnitId="DAN-h4DsAaaYwTpbu6p4" adWidth={728} adHeight={90} />
			</div>
		</div>
	);
}
