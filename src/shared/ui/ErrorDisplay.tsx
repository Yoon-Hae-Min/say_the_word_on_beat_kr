/**
 * ErrorDisplay Component
 *
 * Reusable error message display component.
 * Extracted from ChallengeCreationForm to follow DRY principle.
 *
 * Maintains chalkboard theme consistency across all error displays.
 */

interface ErrorDisplayProps {
	/**
	 * Error message to display
	 */
	message: string;

	/**
	 * Additional CSS classes
	 */
	className?: string;

	/**
	 * Error severity level
	 * @default 'error'
	 */
	severity?: "error" | "warning" | "info";
}

/**
 * Display error message with chalkboard-themed styling
 *
 * @example
 * ```tsx
 * <ErrorDisplay message="Failed to upload image" />
 * <ErrorDisplay message="Warning: Some slots are empty" severity="warning" />
 * ```
 */
export function ErrorDisplay({ message, className = "", severity = "error" }: ErrorDisplayProps) {
	const severityStyles = {
		error: "bg-danger/20 border-danger",
		warning: "bg-warning/20 border-warning",
		info: "bg-info/20 border-info",
	};

	return (
		<div className={`p-3 border rounded-md ${severityStyles[severity]} ${className}`}>
			<p className="text-chalk-white text-sm">{message}</p>
		</div>
	);
}
