import { useEffect, useState } from "react";

interface CountDownGameStateProps {
	onCountdownEnd: () => void;
	initialCount?: number;
}

const CountDownGameState = ({
	onCountdownEnd,
	initialCount = 3,
}: CountDownGameStateProps) => {
	const [countdown, setCountdown] = useState(initialCount);

	useEffect(() => {
		// 카운트가 0이 되면 다음 단계로 이동
		if (countdown === 0) {
			onCountdownEnd();
			return;
		}

		// 1초마다 카운트 감소
		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		// 클린업: 컴포넌트 언마운트 시 타이머 정리
		return () => clearInterval(timer);
	}, [countdown, onCountdownEnd]);

	return (
		<div className="flex items-center justify-center h-full p-4 md:p-6">
			<p className="chalk-text text-chalk-yellow text-7xl md:text-8xl lg:text-9xl font-bold animate-pulse">
				{countdown}
			</p>
		</div>
	);
};

export default CountDownGameState;
