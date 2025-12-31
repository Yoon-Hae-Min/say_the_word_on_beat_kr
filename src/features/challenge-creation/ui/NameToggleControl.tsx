/**
 * NameToggleControl Component
 *
 * Toggle control for showing/hiding image names in the game.
 * Extracted from ChallengeCreationForm to follow Single Responsibility Principle.
 */

interface NameToggleControlProps {
	/**
	 * Whether names are currently shown
	 */
	showNames: boolean;

	/**
	 * Callback when toggle state changes
	 */
	onToggle: (showNames: boolean) => void;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Toggle control for image name display setting
 *
 * @example
 * ```tsx
 * <NameToggleControl
 *   showNames={challengeData.showNames}
 *   onToggle={handleShowNamesToggle}
 * />
 * ```
 */
export default function NameToggleControl({
	showNames,
	onToggle,
	className = "",
}: NameToggleControlProps) {
	return (
		<div
			className={`p-4 border-2 border-chalk-white/30 rounded-md bg-chalkboard-bg/30 ${className}`}
		>
			<label className="flex items-center justify-between cursor-pointer">
				<div>
					<p className="chalk-text text-chalk-white font-bold text-sm">이름 표시</p>
					<p className="text-chalk-white/60 text-xs mt-1">게임 플레이 시 이미지 이름 표시 여부</p>
				</div>
				<div className="relative">
					<input
						type="checkbox"
						checked={showNames}
						onChange={(e) => onToggle(e.target.checked)}
						className="sr-only"
						aria-label="이름 표시 설정"
					/>
					<div
						className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 ${
							showNames ? "bg-chalk-yellow" : "bg-chalk-white/30"
						}`}
					>
						<div
							className={`w-5 h-5 bg-chalkboard-bg rounded-full transition-transform transform ${
								showNames ? "translate-x-5" : "translate-x-0"
							}`}
						/>
					</div>
				</div>
			</label>
		</div>
	);
}
