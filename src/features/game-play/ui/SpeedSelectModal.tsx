"use client";

import { ChalkButton } from "@/shared/ui";
import { type PlaybackSpeed, SPEED_PRESETS } from "../lib/speedPresets";

interface SpeedSelectModalProps {
	isOpen: boolean;
	playbackRate: PlaybackSpeed;
	onSpeedChange: (rate: PlaybackSpeed) => void;
	onStart: () => void;
	onClose: () => void;
}

export default function SpeedSelectModal({
	isOpen,
	playbackRate,
	onSpeedChange,
	onStart,
	onClose,
}: SpeedSelectModalProps) {
	if (!isOpen) return null;

	const currentPresetIndex = SPEED_PRESETS.findIndex((p) => p.rate === playbackRate);
	const currentLabel =
		SPEED_PRESETS.find((p) => p.rate === playbackRate)?.label ?? `${playbackRate}x`;

	const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const index = Number(e.target.value);
		onSpeedChange(SPEED_PRESETS[index].rate);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Overlay */}
			<div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

			{/* Modal */}
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="speed-modal-title"
				className="relative z-10 w-full max-w-sm animate-fade-in rounded-lg bg-chalkboard-bg p-8 shadow-2xl"
			>
				<h2
					id="speed-modal-title"
					className="chalk-text mb-8 text-center text-2xl font-bold text-chalk-white"
				>
					속도 선택
				</h2>

				{/* Speed display */}
				<div className="mb-6 text-center">
					<span className="chalk-text text-5xl font-bold text-chalk-yellow">{currentLabel}</span>
				</div>

				{/* Slider */}
				<div className="mb-8 px-2">
					<input
						type="range"
						min={0}
						max={SPEED_PRESETS.length - 1}
						step={1}
						value={currentPresetIndex}
						onChange={handleSliderChange}
						className="speed-slider w-full"
					/>

					{/* Labels under slider */}
					<div className="mt-2 flex justify-between">
						{SPEED_PRESETS.map((preset) => (
							<span
								key={preset.value}
								className={`text-xs transition-colors ${
									playbackRate === preset.rate
										? "chalk-text text-chalk-yellow"
										: "text-chalk-white/40"
								}`}
							>
								{preset.label}
							</span>
						))}
					</div>
				</div>

				{/* Action buttons */}
				<div className="flex gap-3">
					<ChalkButton variant="yellow" onClick={onStart} className="flex-1">
						확인
					</ChalkButton>
				</div>
			</div>
		</div>
	);
}
