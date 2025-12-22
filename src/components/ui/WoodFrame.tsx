interface WoodFrameProps {
	children: React.ReactNode;
	className?: string;
}

export default function WoodFrame({ children, className = "" }: WoodFrameProps) {
	return (
		<div className={`bg-wood-frame p-4 md:p-6 lg:p-8 ${className}`}>
			<div className="min-h-screen">{children}</div>
		</div>
	);
}
