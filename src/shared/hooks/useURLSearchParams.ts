/**
 * useURLSearchParams Hook
 *
 * Custom hook for managing state via URL query parameters.
 * Provides type-safe getters and setters for URL-based state.
 *
 * Benefits:
 * - Browser back/forward navigation support
 * - Shareable URLs with state
 * - State persistence on page refresh
 * - SEO-friendly
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export interface UseURLSearchParamsOptions<T extends Record<string, string>> {
	/**
	 * Default values for query parameters
	 */
	defaults: T;

	/**
	 * Base path for the URL (e.g., "/challenges")
	 */
	basePath: string;
}

export interface UseURLSearchParamsReturn<T extends Record<string, string>> {
	/**
	 * Get a specific query parameter value with type safety
	 */
	get: <K extends keyof T>(key: K) => T[K];

	/**
	 * Get all query parameters as an object
	 */
	getAll: () => T;

	/**
	 * Update one or more query parameters
	 * Omitted keys will retain their current values
	 */
	set: (updates: Partial<T>) => void;

	/**
	 * Reset all query parameters to default values
	 */
	reset: () => void;
}

/**
 * Custom hook for URL query parameter state management
 *
 * @example
 * ```tsx
 * const urlParams = useURLSearchParams({
 *   defaults: { page: "1", sort: "views" },
 *   basePath: "/challenges",
 * });
 *
 * // Get values
 * const currentPage = Number(urlParams.get("page"));
 * const sortBy = urlParams.get("sort");
 *
 * // Update values
 * urlParams.set({ page: "2" });
 * urlParams.set({ sort: "latest", page: "1" });
 *
 * // Reset to defaults
 * urlParams.reset();
 * ```
 */
export const useURLSearchParams = <T extends Record<string, string>>({
	defaults,
	basePath,
}: UseURLSearchParamsOptions<T>): UseURLSearchParamsReturn<T> => {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Get a specific parameter value
	const get = useCallback(
		<K extends keyof T>(key: K): T[K] => {
			return (searchParams.get(key as string) as T[K]) || defaults[key];
		},
		[searchParams, defaults]
	);

	// Get all parameters as an object
	const getAll = useCallback((): T => {
		const result = { ...defaults };
		for (const key in defaults) {
			const value = searchParams.get(key);
			if (value !== null) {
				result[key] = value as T[Extract<keyof T, string>];
			}
		}
		return result;
	}, [searchParams, defaults]);

	// Update one or more parameters
	const set = useCallback(
		(updates: Partial<T>) => {
			const current = getAll();
			const updated = { ...current, ...updates };

			// Build URLSearchParams only including non-default values
			const params = new URLSearchParams();
			for (const key in updated) {
				if (updated[key] !== defaults[key]) {
					params.set(key, updated[key]);
				}
			}

			// Build URL
			const queryString = params.toString();
			const newURL = queryString ? `${basePath}?${queryString}` : basePath;

			// Update URL without scrolling
			router.push(newURL, { scroll: false });
		},
		[router, basePath, defaults, getAll]
	);

	// Reset all parameters to defaults
	const reset = useCallback(() => {
		router.push(basePath, { scroll: false });
	}, [router, basePath]);

	return {
		get,
		getAll,
		set,
		reset,
	};
};
