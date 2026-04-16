"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";
import { ChalkButton } from "@/shared/ui";

interface NoticeModalProps {
	titleId: string;
	title: string;
	message: ReactNode;
	onClose: () => void;
}

export default function NoticeModal({ titleId, title, message, onClose }: NoticeModalProps) {
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		dialogRef.current?.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />

			<div
				ref={dialogRef}
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				className="relative z-10 w-full max-w-md animate-fade-in rounded-lg bg-chalkboard-bg p-8 shadow-2xl focus:outline-none"
			>
				<button
					type="button"
					onClick={onClose}
					className="absolute right-4 top-4 text-chalk-white transition-colors hover:text-chalk-yellow"
					aria-label="닫기"
				>
					<X size={24} />
				</button>

				<h2 id={titleId} className="chalk-text mb-4 text-3xl font-bold text-chalk-yellow">
					{title}
				</h2>

				<div className="chalk-text mb-8 text-lg leading-relaxed text-chalk-white">{message}</div>

				<div className="flex justify-end">
					<ChalkButton onClick={onClose}>확인</ChalkButton>
				</div>
			</div>
		</div>
	);
}
