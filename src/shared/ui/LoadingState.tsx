/**
 * LoadingState Component
 *
 * Reusable loading indicator component.
 * Extracted from ChallengesPage to promote reusability.
 *
 * Maintains chalkboard theme with animated chalk text.
 */

interface LoadingStateProps {
	/**
	 * Loading message to display
	 * @default "로딩 중..."
	 */
	message?: string;

	/**
	 * Size variant
	 * @default "medium"
	 */
	size?: "small" | "medium" | "large";

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Display loading state with animated chalk text
 *
 * @example
 * ```tsx
 * <LoadingState />
 * <LoadingState message="챌린지를 불러오는 중..." size="large" />
 * ```
 */
export function LoadingState({
	message = "로딩 중...",
	size = "medium",
	className = "",
}: LoadingStateProps) {
	const sizeStyles = {
		small: "text-base py-6",
		medium: "text-xl py-12",
		large: "text-3xl py-16",
	};

	return (
		<div className={`text-center ${sizeStyles[size]} ${className}`}>
			<p className="chalk-text animate-pulse text-chalk-white">{message}</p>
		</div>
	);
}
