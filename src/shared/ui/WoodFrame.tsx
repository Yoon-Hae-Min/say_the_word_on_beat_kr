interface WoodFrameProps {
	children: React.ReactNode;
	className?: string;
}

export default function WoodFrame({ children, className = "" }: WoodFrameProps) {
	return (
		<div
			className={`relative flex border-16 border-solid min-h-screen ${className}`}
			style={{
				borderColor: "#a67c52 #7d5a3a #6b4423 #8b6b4f",
			}}
		>
			<div className="relative flex-1 m-auto h-full z-10">{children}</div>
		</div>
	);
}
