interface HeaderSectionProps {
	title: string;
	onTitleChange: (title: string) => void;
}

export default function HeaderSection({ title, onTitleChange }: HeaderSectionProps) {
	return (
		<div className="mb-6">
			<input
				type="text"
				value={title}
				onChange={(e) => onTitleChange(e.target.value)}
				className="
          w-full px-4 py-3
          bg-chalkboard-bg
          border-2 border-chalk-white
          text-chalk-white chalk-text text-2xl
          placeholder:text-chalk-white/50
          rounded-md
          focus:outline-none focus:border-chalk-yellow
          transition-colors
        "
				placeholder="어떤 챌린지인가요?"
				maxLength={50}
			/>
		</div>
	);
}
