"use client";

import { Upload } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import type { Resource } from "@/entities/resource";
import { ChalkButton } from "@/shared/ui";

interface ResourcePanelProps {
  resources: Resource[];
  selectedResource: Resource | null;
  onUpload: (resource: Resource) => void;
  onSelect: (resource: Resource) => void;
  onNameChange: (id: string, name: string) => void;
}

export default function ResourcePanel({
  resources,
  selectedResource,
  onUpload,
  onSelect,
  onNameChange,
}: ResourcePanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newResource: Resource = {
          id: crypto.randomUUID(),
          imageUrl: event.target?.result as string,
          name: "",
          file: file,
        };
        onUpload(newResource);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
        >
          <Upload size={20} />
          이미지 업로드
        </ChalkButton>
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
              </div>

              {/* Name input */}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
