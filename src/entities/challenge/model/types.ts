import type { Resource } from "@/entities/resource/model/types";
import type { Database } from "../../../../database.types";

// Type aliases from Supabase Database schema
export type BeatSlot = Database["public"]["CompositeTypes"]["beat_slot"];
export type GameConfigStruct = Database["public"]["CompositeTypes"]["game_config_struct"];
export type DatabaseChallenge = Database["public"]["Tables"]["challenges"]["Row"];
export type ChallengeInsert = Database["public"]["Tables"]["challenges"]["Insert"];
export type ChallengeUpdate = Database["public"]["Tables"]["challenges"]["Update"];

// Client-safe challenge type (excludes creator_id for privacy, adds isMine for ownership check)
export type ClientSafeChallenge = Omit<DatabaseChallenge, "creator_id"> & {
	isMine: boolean;
};

// Application-level types (used in UI/business logic)

export interface Challenge {
	id: string;
	title: string;
	thumbnail: string;
	viewCount: number;
	isPublic: boolean;
	showNames: boolean;
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
	showNames: boolean;
	songUrl?: string;
}

// Sort options for challenge queries
export type ChallengeSortBy = "latest" | "views";

// Filter options for challenge queries
export type ChallengeFilter = "all" | "mine";
