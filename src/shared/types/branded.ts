/**
 * Branded types for type-safe IDs
 *
 * These branded types prevent accidental mixing of different ID types at compile time.
 * For example, you cannot pass a ResourceId where a ChallengeId is expected.
 */

export type ChallengeId = string & { readonly __brand: "ChallengeId" };
export type ResourceId = string & { readonly __brand: "ResourceId" };
export type UserId = string & { readonly __brand: "UserId" };

/**
 * Helper constructors to create branded IDs from strings
 */
export const challengeId = (id: string): ChallengeId => id as ChallengeId;
export const resourceId = (id: string): ResourceId => id as ResourceId;
export const userId = (id: string): UserId => id as UserId;

/**
 * Type guards to check if a string is a valid branded ID
 */
export const isChallengeId = (id: string): id is ChallengeId => typeof id === "string";
export const isResourceId = (id: string): id is ResourceId => typeof id === "string";
export const isUserId = (id: string): id is UserId => typeof id === "string";
