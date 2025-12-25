"use client";

import { Eye } from "lucide-react";
import Image from "next/image";

interface ChalkCardProps {
  title: string;
  thumbnail: string;
  viewCount: number;
  onClick?: () => void;
  className?: string;
}

export default function ChalkCard({
  title,
  thumbnail,
  viewCount,
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
        p-4
        transition-all duration-300
        hover:scale-105 hover:brightness-110
        ${className}
      `}
    >
      {/* Thumbnail */}
      <div className="relative mb-3 aspect-video overflow-hidden rounded-md">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Title */}
      <h3 className="chalk-text mb-2 line-clamp-2 text-xl text-chalk-white">
        {title}
      </h3>

      {/* View Count */}
      <div className="flex items-center gap-1 text-chalk-yellow">
        <Eye size={16} />
        <span className="chalk-text text-sm">{viewCount}</span>
      </div>
    </div>
  );
}
