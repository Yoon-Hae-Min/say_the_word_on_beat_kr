/**
 * ResourceCard Component
 *
 * Display a single resource with thumbnail, name input, and delete button.
 * Extracted from ResourcePanel to follow Single Responsibility Principle.
 */

import { X } from "lucide-react";
import Image from "next/image";
import type { Resource } from "@/entities/resource";

interface ResourceCardProps {
	/**
	 * Resource to display
	 */
	resource: Resource;

	/**
	 * Whether this resource is currently selected
	 */
	isSelected: boolean;

	/**
	 * Whether to show the name input field
	 */
	showNameInput: boolean;

	/**
	 * Callback when resource is clicked
	 */
	onSelect: (resource: Resource) => void;

	/**
	 * Callback when resource name changes
	 */
	onNameChange: (id: string, name: string) => void;

	/**
	 * Callback when delete button is clicked
	 */
	onDelete: (id: string) => void;
}

/**
 * Resource card component with thumbnail, name input, and delete button
 *
 * @example
 * ```tsx
 * <ResourceCard
 *   resource={resource}
 *   isSelected={selectedResource?.id === resource.id}
 *   showNameInput={showNames}
 *   onSelect={handleSelect}
 *   onNameChange={handleNameChange}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export default function ResourceCard({
	resource,
	isSelected,
	showNameInput,
	onSelect,
	onNameChange,
	onDelete,
}: ResourceCardProps) {
	return (
		<div
			className={`
        chalk-border chalk-dust
        p-3 cursor-pointer
        transition-all duration-300
        ${
					isSelected
						? "border-chalk-yellow border-4"
						: "border-chalk-white border-2 hover:border-chalk-yellow/50"
				}
      `}
			onClick={() => onSelect(resource)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect(resource);
				}
			}}
			role="button"
			tabIndex={0}
			aria-pressed={isSelected}
		>
			{/* Thumbnail */}
			<div className="relative mb-2 h-[150px] w-[150px] mx-auto">
				<Image
					src={resource.imageUrl}
					alt={resource.name || "업로드된 이미지"}
					className="object-cover"
					fill
				/>
				{/* Delete button */}
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onDelete(resource.id);
					}}
					className="absolute top-1 right-1 bg-chalk-white/20 hover:bg-chalk-white/30 rounded-full w-6 h-6 flex items-center justify-center transition-colors z-10 backdrop-blur-sm"
					aria-label="이미지 삭제"
				>
					<X size={14} className="text-chalk-white" strokeWidth={2.5} />
				</button>
			</div>

			{/* Name input - conditional based on showNameInput */}
			{showNameInput ? (
				<input
					type="text"
					value={resource.name}
					onChange={(e) => {
						e.stopPropagation();
						onNameChange(resource.id, e.target.value);
					}}
					onClick={(e) => e.stopPropagation()}
					className="
            w-full
            py-1 px-2
            bg-chalkboard-bg
            border border-chalk-white/50
            text-chalk-white text-sm text-center
            placeholder:text-chalk-white/30
            rounded
            focus:outline-none focus:border-chalk-yellow
            transition-colors
          "
					placeholder="이름 입력..."
					maxLength={20}
					aria-label="이미지 이름"
				/>
			) : (
				<p className="text-chalk-white/50 text-xs italic text-center py-1">
					이름 표시가 비활성화되어 있습니다
				</p>
			)}
		</div>
	);
}
