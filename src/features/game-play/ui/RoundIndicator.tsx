/**
 * RoundIndicator Component
 *
 * Displays the current round number during game play.
 * Extracted from PlayingGameStage to follow Single Responsibility Principle.
 */

interface RoundIndicatorProps {
	/**
	 * Current round number (1-based)
	 */
	currentRound: number;

	/**
	 * Total number of rounds
	 */
	totalRounds: number;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Round indicator component
 *
 * @example
 * ```tsx
 * <RoundIndicator currentRound={3} totalRounds={5} />
 * ```
 */
export default function RoundIndicator({
	currentRound,
	totalRounds,
	className = "",
}: RoundIndicatorProps) {
	return (
		<div className={`fixed top-8 left-1/2 -translate-x-1/2 md:top-16 z-10 ${className}`}>
			<p className="chalk-text text-chalk-white text-xl md:text-3xl text-center">
				라운드 {currentRound} / {totalRounds}
			</p>
		</div>
	);
}
