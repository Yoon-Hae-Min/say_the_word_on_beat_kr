interface WoodFrameProps {
	children: React.ReactNode;
	className?: string;
}

export default function WoodFrame({ children, className = "" }: WoodFrameProps) {
	return (
		<div className={`wood-frame ${className}`}>
			<div className="relative min-h-screen z-10">{children}</div>
		</div>
	);
}
