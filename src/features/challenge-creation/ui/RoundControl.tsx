import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChalkButton } from "@/shared/ui";

interface RoundControlProps {
	currentRound: number;
	totalRounds: number;
	onPrevious: () => void;
	onNext: () => void;
}

export default function RoundControl({
	currentRound,
	totalRounds,
	onPrevious,
	onNext,
}: RoundControlProps) {
	return (
		<div className="mt-6 flex items-center justify-center gap-4">
			<ChalkButton
				variant="white"
				onClick={onPrevious}
				disabled={currentRound === 1}
				className="px-4 py-2"
			>
				<ChevronLeft size={20} />
			</ChalkButton>

			<div className="chalk-text text-2xl text-chalk-yellow">
				Round <span className="font-bold">{currentRound}</span> / {totalRounds}
			</div>

			<ChalkButton
				variant="white"
				onClick={onNext}
				disabled={currentRound === totalRounds}
				className="px-4 py-2"
			>
				<ChevronRight size={20} />
			</ChalkButton>
		</div>
	);
}
