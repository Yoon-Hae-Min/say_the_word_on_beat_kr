"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_ROUNDS, MIN_ROUNDS } from "../lib/roundConfig";

interface RoundCountSelectorProps {
	totalRounds: number;
	onChange: (count: number) => void;
}

export default function RoundCountSelector({ totalRounds, onChange }: RoundCountSelectorProps) {
	return (
		<div className="flex items-center justify-center gap-3">
			<span className="chalk-text text-sm text-chalk-white/70">라운드 수</span>
			<div className="flex items-center gap-2">
				<button
					type="button"
					aria-label="라운드 수 줄이기"
					onClick={() => onChange(totalRounds - 1)}
					disabled={totalRounds <= MIN_ROUNDS}
					className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-chalk-white/30 text-chalk-white/70 transition-colors hover:border-chalk-yellow/50 hover:text-chalk-yellow disabled:opacity-30 disabled:hover:border-chalk-white/30 disabled:hover:text-chalk-white/70"
				>
					<Minus size={14} />
				</button>
				<span className="chalk-text min-w-[2ch] text-center text-lg font-bold text-chalk-yellow">
					{totalRounds}
				</span>
				<button
					type="button"
					aria-label="라운드 수 늘리기"
					onClick={() => onChange(totalRounds + 1)}
					disabled={totalRounds >= MAX_ROUNDS}
					className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-chalk-white/30 text-chalk-white/70 transition-colors hover:border-chalk-yellow/50 hover:text-chalk-yellow disabled:opacity-30 disabled:hover:border-chalk-white/30 disabled:hover:text-chalk-white/70"
				>
					<Plus size={14} />
				</button>
			</div>
		</div>
	);
}
