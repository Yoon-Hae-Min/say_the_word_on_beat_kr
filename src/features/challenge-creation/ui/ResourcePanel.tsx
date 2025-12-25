"use client";

import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import type { Resource } from "@/entities/resource";
import { ChalkButton } from "@/shared/ui";
import { compressImage, fileToDataURL } from "@/shared/lib/image";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCompressing, setIsCompressing] = useState(false);

  // Helper function to process image files (shared by file input and paste)
  const processImageFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsCompressing(true);

    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          alert("이미지 파일만 업로드 가능합니다");
          continue;
        }

        try {
          // Compress the image
          const compressedFile = await compressImage(file);

          // Convert to data URL for preview
          const dataUrl = await fileToDataURL(compressedFile);

          const newResource: Resource = {
            id: crypto.randomUUID(),
            imageUrl: dataUrl,
            name: "",
            file: compressedFile, // Store compressed file
          };
          onUpload(newResource);
        } catch (error) {
          console.error("Error processing image:", error);
          alert(`이미지 처리 실패: ${file.name}`);
        }
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    await processImageFiles(Array.from(files));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle paste event
  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      await processImageFiles(imageFiles);
    }
  };

  // Add paste event listener
  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Upload button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <ChalkButton
          variant="blue"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2"
          disabled={isCompressing}
        >
          <Upload size={20} />
          {isCompressing ? "압축 중..." : "이미지 업로드"}
        </ChalkButton>
        <p className="text-chalk-white/60 text-xs text-center mt-2">
          클릭하거나 이미지를 붙여넣기 (Ctrl+V)
        </p>
      </div>

      {/* Resources list - Grid layout */}
      <div className="max-h-[calc(100vh-400px)] lg:max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 gap-4 p-1">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className={`
                chalk-border chalk-dust
                p-3 cursor-pointer
                transition-all duration-300
                ${
                  selectedResource?.id === resource.id
                    ? "border-chalk-yellow border-4"
                    : "border-chalk-white border-2 hover:border-chalk-yellow/50"
                }
              `}
              onClick={() => onSelect(resource)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(resource);
                }
              }}
              role="button"
              tabIndex={0}
            >
              {/* Thumbnail - same size as stage grid slots */}
              <div className="relative mb-2 h-[150px] w-[150px] mx-auto">
                <Image
                  src={resource.imageUrl}
                  alt={resource.name || "업로드된 이미지"}
                  className="object-cover"
                  fill
                />
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(resource.id);
                  }}
                  className="absolute top-1 right-1 bg-chalk-white/20 hover:bg-chalk-white/30 rounded-full w-6 h-6 flex items-center justify-center transition-colors z-10 backdrop-blur-sm"
                  aria-label="이미지 삭제"
                >
                  <X size={14} className="text-chalk-white" strokeWidth={2.5} />
                </button>
              </div>

              {/* Name input - conditional based on showNames */}
              {showNames && (
                <input
                  type="text"
                  value={resource.name}
                  onChange={(e) => {
                    e.stopPropagation();
                    onNameChange(resource.id, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="
                    w-full
                    py-1 px-2
                    bg-chalkboard-bg
                    border border-chalk-white/50
                    text-chalk-white text-sm text-center
                    placeholder:text-chalk-white/30
                    rounded
                    focus:outline-none focus:border-chalk-yellow
                    transition-colors
                  "
                  placeholder="이름 입력..."
                  maxLength={20}
                />
              )}
              {!showNames && (
                <p className="text-chalk-white/50 text-xs italic text-center py-1">
                  이름 표시가 비활성화되어 있습니다
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
