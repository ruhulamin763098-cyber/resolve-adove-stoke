import React, { useCallback, useState } from "react";
import { UploadCloud, Image, FileImage, Plus } from "lucide-react";
import { AnalyzedImage } from "../types";

interface ImageDropzoneProps {
  onImagesAdded: (images: Omit<AnalyzedImage, "status">[]) => void;
}

export default function ImageDropzone({ onImagesAdded }: ImageDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const processFiles = useCallback(
    (files: FileList) => {
      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          validFiles.push(file);
        }
      }

      if (validFiles.length === 0) return;

      const newImages: Omit<AnalyzedImage, "status">[] = [];
      let processedCount = 0;

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push({
              id: crypto.randomUUID(),
              filename: file.name,
              dataUrl: e.target.result as string,
              fileSize: file.size,
              mimeType: file.type,
            });
          }

          processedCount++;
          if (processedCount === validFiles.length) {
            onImagesAdded(newImages);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [onImagesAdded]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-sm p-5 text-center cursor-pointer transition-all ${
        isDragActive
          ? "border-[#0265DC] bg-[#0265DC]/5"
          : "border-[#333333] bg-[#252525] hover:border-[#444444] hover:bg-[#2d2d2d]"
      }`}
      onClick={() => document.getElementById("file-upload-input")?.click()}
      id="dropzone-container"
    >
      <input
        type="file"
        id="file-upload-input"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
      />
      <div className="flex items-center justify-center space-x-3 text-left">
        <div className="p-2 bg-[#1a1a1a] border border-[#333333] rounded-sm text-[#0265DC] transition-transform">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white">
            Drag files here or <span className="text-[#0265DC] underline">browse computer</span>
          </p>
          <p className="text-[10px] text-[#999999] mt-0.5 leading-tight">
            Supports JPEG, PNG, WEBP. Upload multiple images for batch CSV production.
          </p>
        </div>
      </div>
    </div>
  );
}
