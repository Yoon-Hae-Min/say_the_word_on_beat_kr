/**
 * useClipboardPaste Hook
 *
 * Reusable custom hook for handling clipboard paste events.
 * Extracted from ResourcePanel component.
 *
 * This hook listens for global paste events and extracts image files from the clipboard,
 * making it reusable across any component that needs image paste functionality.
 */

import { useEffect } from "react";

export interface UseClipboardPasteOptions {
	/**
	 * Callback function to handle pasted files
	 */
	onPaste: (files: File[]) => Promise<void> | void;

	/**
	 * Whether the paste listener is enabled
	 * @default true
	 */
	enabled?: boolean;

	/**
	 * Filter function to determine which file types to accept
	 * @default Accepts all image/* types
	 */
	acceptFilter?: (file: File) => boolean;
}

/**
 * Custom hook to handle clipboard paste events for files (especially images)
 *
 * @example
 * ```tsx
 * useClipboardPaste({
 *   onPaste: async (files) => {
 *     console.log('Pasted files:', files);
 *     // Process files...
 *   },
 *   enabled: true,
 * });
 * ```
 */
export const useClipboardPaste = ({
	onPaste,
	enabled = true,
	acceptFilter = (file: File) => file.type.startsWith("image/"),
}: UseClipboardPasteOptions): void => {
	useEffect(() => {
		if (!enabled) {
			return;
		}

		const handlePaste = async (e: ClipboardEvent) => {
			const items = e.clipboardData?.items;
			if (!items) return;

			const files: File[] = [];

			// Extract files from clipboard items
			for (let i = 0; i < items.length; i++) {
				const item = items[i];

				// Check if item is a file
				if (item.kind === "file") {
					const file = item.getAsFile();

					// Apply filter if file exists
					if (file && acceptFilter(file)) {
						files.push(file);
					}
				}
			}

			// If we have valid files, prevent default behavior and call callback
			if (files.length > 0) {
				e.preventDefault();
				await onPaste(files);
			}
		};

		// Add event listener
		document.addEventListener("paste", handlePaste);

		// Cleanup on unmount
		return () => {
			document.removeEventListener("paste", handlePaste);
		};
	}, [onPaste, enabled, acceptFilter]);
};
