/**
 * ResourceUploadButton Component
 *
 * Upload button for adding new images.
 * Extracted from ResourcePanel to follow Single Responsibility Principle.
 */

import { Upload } from "lucide-react";
import { useRef } from "react";
import { ChalkButton } from "@/shared/ui";

interface ResourceUploadButtonProps {
	/**
	 * Whether the button is disabled (e.g., during compression)
	 */
	disabled?: boolean;

	/**
	 * Loading state text
	 */
	loadingText?: string;

	/**
	 * Callback when files are selected
	 */
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Upload button component with file input
 *
 * @example
 * ```tsx
 * <ResourceUploadButton
 *   disabled={isCompressing}
 *   loadingText="압축 중..."
 *   onFileChange={handleFileChange}
 * />
 * ```
 */
export default function ResourceUploadButton({
	disabled = false,
	loadingText = "압축 중...",
	onFileChange,
	className = "",
}: ResourceUploadButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	return (
		<div className={className}>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				multiple
				onChange={onFileChange}
				className="hidden"
				aria-label="이미지 파일 선택"
			/>
			<ChalkButton
				variant="blue"
				onClick={() => fileInputRef.current?.click()}
				className="w-full flex items-center justify-center gap-2"
				disabled={disabled}
			>
				<Upload size={20} />
				{disabled ? loadingText : "이미지 업로드"}
			</ChalkButton>
			<p className="text-chalk-white/60 text-xs text-center mt-2">
				클릭하거나 이미지를 붙여넣기 (Ctrl+V)
			</p>
		</div>
	);
}
