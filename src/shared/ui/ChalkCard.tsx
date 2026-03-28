"use client";

import { Eye, Lock, User } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/shared/ui/badge";
import DifficultyText from "./DifficultyText";

interface ChalkCardProps {
	title: string;
	thumbnail: string;
	viewCount: number;
	isPublic: boolean;
	isMine?: boolean;
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
	isMine = false,
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
        bg-chalk-white/5
        rounded-lg
        overflow-hidden
        transition-all duration-300
        hover:scale-[1.03] hover:bg-chalkboard-bg/80
        hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]
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
				{/* Badges */}
				<div className="absolute right-2 top-2 flex gap-1.5">
					{isMine && (
						<Badge variant="secondary" className="bg-chalk-yellow/90 text-chalkboard-bg">
							<User size={12} className="mr-1" />내 챌린지
						</Badge>
					)}
					{!isPublic && (
						<Badge variant="secondary" className="bg-chalk-white/90 text-chalkboard-bg">
							<Lock size={12} className="mr-1" />
							비공개
						</Badge>
					)}
				</div>
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
