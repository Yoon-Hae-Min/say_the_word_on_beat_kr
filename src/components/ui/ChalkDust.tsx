interface ChalkDustProps {
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	intensity?: "low" | "medium" | "high";
	color?: "white" | "yellow" | "blue";
}

export default function ChalkDust({
	position = "top-right",
	intensity = "medium",
	color = "white",
}: ChalkDustProps) {
	const positionStyles = {
		"top-left": "top-4 left-4",
		"top-right": "top-4 right-4",
		"bottom-left": "bottom-4 left-4",
		"bottom-right": "bottom-4 right-4",
	};

	const intensityStyles = {
		low: "w-8 h-8 opacity-20",
		medium: "w-16 h-16 opacity-30",
		high: "w-24 h-24 opacity-40",
	};

	const colorStyles = {
		white: "bg-chalk-white",
		yellow: "bg-chalk-yellow",
		blue: "bg-chalk-blue",
	};

	return (
		<div
			className={`
        absolute
        rounded-full
        blur-xl
        pointer-events-none
        ${positionStyles[position]}
        ${intensityStyles[intensity]}
        ${colorStyles[color]}
      `}
			aria-hidden="true"
		/>
	);
}
