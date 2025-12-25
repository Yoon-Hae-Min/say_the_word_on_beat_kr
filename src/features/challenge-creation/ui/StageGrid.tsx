import { X } from "lucide-react";
import Image from "next/image";
import type { Slot } from "@/entities/challenge";
import type { Resource } from "@/entities/resource";

interface StageGridProps {
	slots: Slot[];
	resources: Resource[];
	onSlotClick: (index: number) => void;
	onSlotClear?: (index: number) => void;
	showNames: boolean;
}

export default function StageGrid({
	slots,
	resources,
	onSlotClick,
	onSlotClear,
	showNames,
}: StageGridProps) {
	const getResourceById = (id: string | null) => {
		if (!id) return null;
		return resources.find((r) => r.id === id);
	};

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			{slots.map((slot, index) => {
				const resource = getResourceById(slot.resourceId);
				const isEmpty = !resource;

				return (
					<div
						key={index}
						onClick={() => onSlotClick(index)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								onSlotClick(index);
							}
						}}
						role="button"
						tabIndex={0}
						aria-label={`슬롯 ${index + 1}${isEmpty ? " (비어있음)" : `: ${resource.name}`}`}
						className={`
              relative aspect-square
              rounded-md
              cursor-pointer
              transition-all duration-300
              ${
								isEmpty
									? `
                border-2 border-dashed border-chalk-white/50
                flex items-center justify-center
                hover:border-chalk-yellow hover:bg-chalk-yellow/10
              `
									: `
                border-4 border-chalk-white
                overflow-hidden
                group
                hover:scale-105 hover:brightness-110
              `
							}
            `}
					>
						{isEmpty ? (
							<div className="text-center px-2">
								<p className="text-chalk-white/50 text-xs md:text-sm">
									클릭하여
									<br />
									배치
								</p>
								<p className="text-chalk-yellow/70 text-xs mt-1">{index + 1}</p>
							</div>
						) : (
							<>
								<Image
									src={resource.imageUrl}
									alt={resource.name}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 50vw, 25vw"
								/>
								{showNames && (
									<div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
										<p className="chalk-text text-chalk-yellow text-center text-sm truncate">
											{resource.name || "이름 없음"}
										</p>
									</div>
								)}
								{/* Clear button */}
								<button
									onClick={(e) => {
										e.stopPropagation();
										onSlotClear?.(index);
									}}
									className="absolute top-1 right-1 bg-chalk-white/20 hover:bg-chalk-white/30 rounded-full w-6 h-6 flex items-center justify-center transition-colors z-10 backdrop-blur-sm"
									aria-label="슬롯 비우기"
								>
									<X size={14} className="text-chalk-white" strokeWidth={2.5} />
								</button>
							</>
						)}
					</div>
				);
			})}
		</div>
	);
}
