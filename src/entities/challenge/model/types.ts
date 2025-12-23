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
// These match the composite types defined in database.types.ts

export interface BeatSlot {
	imagePath: string | null;
	displayText: string | null;
}

export interface GameConfigStruct {
	roundIndex: number | null;
	slots: BeatSlot[] | null;
}

export interface DatabaseChallenge {
	id: string;
	title: string;
	is_public: boolean;
	view_count: number;
	thumbnail_url: string | null;
	game_config: GameConfigStruct[] | null;
	created_at: string;
}
