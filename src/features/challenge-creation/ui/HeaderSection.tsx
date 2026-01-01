"use client";

import { useEffect, useRef } from "react";

interface HeaderSectionProps {
	title: string;
	onTitleChange: (title: string) => void;
}

export default function HeaderSection({ title, onTitleChange }: HeaderSectionProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const spanRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (inputRef.current && spanRef.current) {
			// Set input width to match the hidden span's width
			const width = spanRef.current.offsetWidth;
			const parentWidth = inputRef.current.parentElement?.offsetWidth || 0;
			const maxWidth = parentWidth - 32; // Account for px-4 padding (16px * 2)
			const finalWidth = Math.min(Math.max(width, 200), maxWidth);
			inputRef.current.style.width = `${finalWidth}px`;
		}
	}, []);

	return (
		<div className="flex justify-center w-full">
			{/* Hidden span to measure text width */}
			<span
				ref={spanRef}
				className="invisible absolute chalk-text text-2xl px-4 whitespace-pre"
				aria-hidden="true"
			>
				{title || "어떤 챌린지인가요?"}
			</span>

			<input
				ref={inputRef}
				type="text"
				value={title}
				onChange={(e) => onTitleChange(e.target.value)}
				style={{ maxWidth: "100%" }}
				className="
          px-4 py-3
          bg-chalkboard-bg
          border-b-2 border-chalk-white
          text-chalk-white chalk-text text-2xl
          placeholder:text-chalk-white/50
          focus:outline-none focus:border-chalk-yellow
          transition-all
          text-center
          min-w-[200px]
          w-full
        "
				placeholder="어떤 챌린지인가요?"
				maxLength={50}
			/>
		</div>
	);
}
