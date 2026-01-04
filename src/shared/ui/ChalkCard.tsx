"use client";

import { Eye } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import DifficultyText from "./DifficultyText";

interface ChalkCardProps {
	title: string;
	thumbnail: string;
	viewCount: number;
	isPublic: boolean;
	difficultyStats?: {
		easy: number;
		normal: number;
		hard: number;
	};
	onClick?: () => void;
	className?: string;
}

export default function ChalkCard({
	title,
	thumbnail,
	viewCount,
	isPublic,
	difficultyStats,
	onClick,
	className = "",
}: ChalkCardProps) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (onClick && (e.key === "Enter" || e.key === " ")) {
			e.preventDefault();
			onClick();
		}
	};

	return (
		<div
			onClick={onClick}
			onKeyDown={handleKeyDown}
			role="button"
			tabIndex={0}
			className={`
        group cursor-pointer
        bg-chalkboard-bg
        chalk-border border-chalk-white
        chalk-dust
        overflow-hidden
        transition-all duration-300
        hover:scale-105 hover:brightness-110
        ${className}
      `}
		>
			{/* Thumbnail */}
			<div className="relative aspect-video overflow-hidden">
				<Image
					src={thumbnail}
					alt={title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
				/>
				{/* Private Badge */}
				{!isPublic && (
					<div className="absolute right-2 top-2">
						<Badge variant="secondary" className="bg-chalk-white/90 text-chalkboard-bg">
							Private
						</Badge>
					</div>
				)}
			</div>

			{/* Content Area */}
			<div className="p-4">
				{/* Difficulty */}
				{difficultyStats && (
					<div className="mb-2">
						<DifficultyText stats={difficultyStats} />
					</div>
				)}

				{/* Title */}
				<h3 className="chalk-text mb-2 line-clamp-2 text-xl text-chalk-white">{title}</h3>

				{/* View Count */}
				<div className="flex items-center gap-1 text-chalk-yellow">
					<Eye size={16} />
					<span className="chalk-text text-sm">{viewCount}</span>
				</div>
			</div>
		</div>
	);
}
