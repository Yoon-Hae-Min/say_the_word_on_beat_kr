import type { LucideIcon } from "lucide-react";
import { Flame, Smile, Zap } from "lucide-react";
import type { DifficultyLevel } from "@/shared/lib/difficulty";

export interface DifficultyConfig {
	icon: LucideIcon;
	label: string;
	color: string;
	activeColor: string;
}

export const difficultyConfig: Record<DifficultyLevel, DifficultyConfig> = {
	easy: {
		icon: Smile,
		label: "쉬움",
		color:
			"text-chalk-white/60 border-chalk-white/20 hover:border-chalk-white/40 hover:text-chalk-white",
		activeColor: "text-chalk-blue border-chalk-blue/60 bg-chalk-blue/10",
	},
	normal: {
		icon: Zap,
		label: "보통",
		color:
			"text-chalk-white/60 border-chalk-white/20 hover:border-chalk-blue/40 hover:text-chalk-blue",
		activeColor: "text-chalk-white border-chalk-white/60 bg-chalk-white/10",
	},
	hard: {
		icon: Flame,
		label: "어려움",
		color:
			"text-chalk-white/60 border-chalk-white/20 hover:border-chalk-yellow/40 hover:text-chalk-yellow",
		activeColor: "text-chalk-yellow border-chalk-yellow/60 bg-chalk-yellow/10",
	},
};
