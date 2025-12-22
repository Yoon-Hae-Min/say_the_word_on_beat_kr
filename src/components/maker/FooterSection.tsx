import ChalkButton from "@/components/ui/ChalkButton";

interface FooterSectionProps {
	onGenerate: () => void;
	disabled: boolean;
}

export default function FooterSection({ onGenerate, disabled }: FooterSectionProps) {
	return (
		<div className="mt-8 flex justify-center">
			<ChalkButton
				variant="yellow"
				onClick={onGenerate}
				disabled={disabled}
				className="text-xl px-12 py-4"
			>
				생성하기
			</ChalkButton>
		</div>
	);
}
