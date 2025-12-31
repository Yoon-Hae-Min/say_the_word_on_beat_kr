/**
 * EmptyState Component
 *
 * Reusable empty state display component.
 * Extracted from ChallengesPage to promote reusability.
 *
 * Maintains chalkboard theme with chalk text styling.
 */

interface EmptyStateProps {
	/**
	 * Main message to display
	 */
	message: string;

	/**
	 * Optional subtitle/description
	 */
	description?: string;

	/**
	 * Optional action button
	 */
	action?: React.ReactNode;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Display empty state with message and optional description
 *
 * @example
 * ```tsx
 * <EmptyState
 *   message="아직 공개된 챌린지가 없습니다."
 *   description="첫 번째 챌린지를 만들어보세요!"
 * />
 *
 * <EmptyState
 *   message="검색 결과가 없습니다"
 *   action={<Button onClick={() => resetSearch()}>검색 초기화</Button>}
 * />
 * ```
 */
export function EmptyState({ message, description, action, className = "" }: EmptyStateProps) {
	return (
		<div className={`py-12 text-center ${className}`}>
			<p className="chalk-text text-xl text-chalk-white">{message}</p>
			{description && <p className="mt-2 text-chalk-white/60">{description}</p>}
			{action && <div className="mt-6">{action}</div>}
		</div>
	);
}
