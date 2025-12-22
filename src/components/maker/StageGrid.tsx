import Image from "next/image";
import type { Slot } from "@/types/challenge";
import type { Resource } from "@/types/resource";

interface StageGridProps {
	slots: Slot[];
	resources: Resource[];
	selectedResource: Resource | null;
	onSlotClick: (index: number) => void;
}

export default function StageGrid({
	slots,
	resources,
	selectedResource,
	onSlotClick,
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
              ${selectedResource && isEmpty ? "ring-2 ring-chalk-yellow ring-offset-2 ring-offset-chalkboard-bg" : ""}
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
								<div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
									<p className="chalk-text text-chalk-yellow text-center text-sm truncate">
										{resource.name || "이름 없음"}
									</p>
								</div>
								<div className="absolute top-1 right-1 bg-black/50 rounded-full w-6 h-6 flex items-center justify-center">
									<span className="text-chalk-yellow text-xs font-bold">{index + 1}</span>
								</div>
							</>
						)}
					</div>
				);
			})}
		</div>
	);
}
