/**
 * ChalkSelect Component
 *
 * Chalkboard-themed select dropdown component using shadcn/ui.
 * Provides a consistent select interface with the chalkboard design system.
 */

"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface ChalkSelectOption {
	/**
	 * Value of the option
	 */
	value: string;

	/**
	 * Display label
	 */
	label: string;
}

interface ChalkSelectProps {
	/**
	 * Current selected value
	 */
	value: string;

	/**
	 * Available options
	 */
	options: readonly ChalkSelectOption[];

	/**
	 * Callback when value changes
	 */
	onChange: (value: string) => void;

	/**
	 * Label for the select
	 */
	label?: string;

	/**
	 * Placeholder text when no value selected
	 */
	placeholder?: string;

	/**
	 * Additional CSS classes
	 */
	className?: string;
}

/**
 * Chalkboard-themed select component using shadcn/ui
 *
 * @example
 * ```tsx
 * <ChalkSelect
 *   value={sortBy}
 *   options={[
 *     { value: "latest", label: "최신순" },
 *     { value: "views", label: "조회순" }
 *   ]}
 *   onChange={setSortBy}
 *   label="정렬"
 * />
 * ```
 */
export default function ChalkSelect({
	value,
	options,
	onChange,
	label,
	placeholder = "선택하세요",
	className = "",
}: ChalkSelectProps) {
	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{label && (
				<div className="chalk-text text-sm font-medium text-chalk-white/80 md:text-base">
					{label}
				</div>
			)}
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="chalk-text w-full rounded-lg border-2 border-chalk-white/30 bg-chalkboard-bg/60 px-4 py-2.5 text-base text-chalk-white transition-all hover:border-chalk-yellow/50 focus:border-chalk-yellow focus:ring-2 focus:ring-chalk-yellow/30 md:text-lg [&>svg]:text-chalk-white">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent className="rounded-lg border-2 border-chalk-white/30 bg-chalkboard-bg shadow-xl">
					{options.map((option) => (
						<SelectItem
							key={option.value}
							value={option.value}
							className="chalk-text cursor-pointer text-base text-chalk-white transition-colors hover:bg-chalk-yellow/20 focus:bg-chalk-yellow/30 focus:text-chalk-white md:text-lg"
						>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
