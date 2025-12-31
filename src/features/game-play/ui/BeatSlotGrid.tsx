/**
 * BeatSlotGrid Component
 *
 * Grid of slots displaying images with beat-based highlighting.
 * Extracted from PlayingGameStage to follow Single Responsibility Principle.
 */

import Image from "next/image";
import type { BeatSlot } from "@/entities/challenge/model/types";

interface BeatSlotGridProps {
	/**
	 * Array of slots to display
	 */
	slots: BeatSlot[];

	/**
	 * Index of currently focused slot (0-based), or null if no slot is focused
	 */
	focusedIndex: number | null;

	/**
	 * Whether to show image names
	 */
	showNames: boolean;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Grid of beat slots with highlighting
 *
 * @example
 * ```tsx
 * <BeatSlotGrid
 *   slots={currentSlots}
 *   focusedIndex={focusedIndex}
 *   showNames={challengeData.show_names}
 * />
 * ```
 */
export default function BeatSlotGrid({
	slots,
	focusedIndex,
	showNames,
	className = "",
}: BeatSlotGridProps) {
	return (
		<div className={`grid grid-cols-4 gap-1 md:gap-2 lg:gap-3 ${className}`}>
			{slots?.map((slot, index) => {
				const imagePath = slot.imagePath;
				const isFocused = focusedIndex === index;
				const name = slot.displayText ?? "";

				return (
					<div
						key={index}
						className={`
              relative aspect-square rounded-md overflow-hidden
              transition-transform duration-300
              ${isFocused ? "ring-4 ring-chalk-yellow" : ""}
            `}
					>
						{imagePath ? (
							<>
								<Image src={imagePath} alt={name} fill className="object-cover" unoptimized />
								{showNames && name && (
									<div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 md:p-2">
										<p className="chalk-text text-chalk-yellow text-center text-xs md:text-base font-bold truncate">
											{name}
										</p>
									</div>
								)}
							</>
						) : (
							<div className="flex items-center justify-center h-full">
								<p className="text-chalk-white/50 text-xs">비어있음</p>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
