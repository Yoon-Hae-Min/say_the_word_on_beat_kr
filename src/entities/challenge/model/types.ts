import type { Resource } from "@/entities/resource/model/types";

export interface Challenge {
	id: string;
	title: string;
	thumbnail: string;
	viewCount: number;
	isPublic: boolean;
	createdAt: string;
}

export interface Slot {
	resourceId: string | null;
}

export interface Round {
	id: number;
	slots: Slot[];
}

export interface ChallengeData {
	title: string;
	rounds: Round[];
	resources: Resource[];
	isPublic: boolean;
	songUrl?: string;
}

// Database schema types for Supabase integration

export interface GameConfigSlot {
	imagePath: string;
	displayText: string;
}

export interface GameConfigRound {
	roundIndex: number;
	slots: GameConfigSlot[];
}

export interface GameConfig {
	rounds: GameConfigRound[];
	songUrl?: string;
}

export interface DatabaseChallenge {
	id: string;
	title: string;
	is_public: boolean;
	view_count: number;
	game_config: GameConfig;
	created_at: string;
}
