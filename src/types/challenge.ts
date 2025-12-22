import type { Resource } from "./resource";

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
}
