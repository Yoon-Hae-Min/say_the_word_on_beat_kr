/**
 * ResourcePanel Component (Refactored)
 *
 * Manages image resources for challenge creation.
 * Refactored to use composition of smaller components and custom hooks.
 *
 * This is the refactored version that will replace the original ResourcePanel.tsx
 */

"use client";

import type { Resource } from "@/entities/resource";
import { useClipboardPaste } from "@/shared/hooks";
import { useImageUpload } from "../hooks/useImageUpload";
import ResourceCard from "./ResourceCard";
import ResourceUploadButton from "./ResourceUploadButton";

interface ResourcePanelProps {
	resources: Resource[];
	selectedResource: Resource | null;
	onUpload: (resource: Resource) => void;
	onSelect: (resource: Resource) => void;
	onNameChange: (id: string, name: string) => void;
	onDelete: (id: string) => void;
	showNames: boolean;
}

export default function ResourcePanel({
	resources,
	selectedResource,
	onUpload,
	onSelect,
	onNameChange,
	onDelete,
	showNames,
}: ResourcePanelProps) {
	// Use custom hooks
	const { isCompressing, processImageFiles, handleFileChange } = useImageUpload();

	// Handle clipboard paste
	useClipboardPaste({
		onPaste: async (files) => {
			const processedResources = await processImageFiles(files);
			processedResources.forEach((resource) => {
				onUpload(resource);
			});
		},
		enabled: true,
	});

	// Handle file input change
	const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		await handleFileChange(e, onUpload);
	};

	return (
		<div className="space-y-4">
			{/* Upload button */}
			<ResourceUploadButton
				disabled={isCompressing}
				loadingText="압축 중..."
				onFileChange={onFileInputChange}
			/>

			{/* Resources list - Grid layout */}
			<div className="max-h-[calc(100vh-400px)] lg:max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
				<div className="grid grid-cols-1 gap-4 p-1">
					{resources.map((resource) => (
						<ResourceCard
							key={resource.id}
							resource={resource}
							isSelected={selectedResource?.id === resource.id}
							showNameInput={showNames}
							onSelect={onSelect}
							onNameChange={onNameChange}
							onDelete={onDelete}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
