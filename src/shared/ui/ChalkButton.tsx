"use client";

interface ChalkButtonProps {
	children: React.ReactNode;
	variant?: "yellow" | "blue" | "white" | "white-outline";
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
}

export default function ChalkButton({
	children,
	variant = "yellow",
	onClick,
	disabled = false,
	className = "",
}: ChalkButtonProps) {
	const variantStyles = {
		yellow: "bg-chalk-yellow text-chalkboard-bg border-chalk-yellow hover:brightness-110",
		blue: "bg-chalk-blue text-chalkboard-bg border-chalk-blue hover:brightness-110",
		white: "bg-chalk-white text-chalkboard-bg border-chalk-white hover:brightness-110",
		"white-outline": "bg-transparent text-chalk-white border-chalk-white hover:bg-chalk-white/10",
	};

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`
        chalk-text chalk-border 
        px-6 py-3
        transition-all duration-300
        hover:scale-105 hover-wiggle
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variantStyles[variant]}
        ${className}
      `}
		>
			{children}
		</button>
	);
}
