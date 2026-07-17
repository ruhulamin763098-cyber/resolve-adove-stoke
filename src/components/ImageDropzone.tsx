import React, { useCallback, useState } from "react";
import { UploadCloud, Image, FileImage, Plus } from "lucide-react";
import { AnalyzedImage } from "../types";
import { resizeAndCompressImage } from "../utils/image";

interface ImageDropzoneProps {
  onImagesAdded: (images: Omit<AnalyzedImage, "status">[]) => void;
  lang: "bn" | "en";
}

export default function ImageDropzone({ onImagesAdded, lang }: ImageDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const isBN = lang === "bn";

  const processFiles = useCallback(
    async (files: FileList) => {
      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          validFiles.push(file);
        }
      }

      if (validFiles.length === 0) return;

      try {
        const results = await Promise.all(
          validFiles.map(async (file) => {
            try {
              const resizedDataUrl = await resizeAndCompressImage(file);
              return {
                id: crypto.randomUUID(),
                filename: file.name,
                dataUrl: resizedDataUrl,
                fileSize: file.size,
                mimeType: file.type === "image/svg+xml" ? "image/svg+xml" : "image/jpeg",
              } as Omit<AnalyzedImage, "status">;
            } catch (err) {
              console.error(`Failed to process file ${file.name}:`, err);
              return null;
            }
          })
        );

        const newImages = results.filter((img): img is Omit<AnalyzedImage, "status"> => img !== null);
        if (newImages.length > 0) {
          onImagesAdded(newImages);
        }
      } catch (err) {
        console.error("Failed to process files in batch:", err);
      }
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
            {isBN ? (
              <span>এখানে ফাইল ড্র্যাগ করুন অথবা <span className="text-[#0265DC] underline">কম্পিউটার ব্রাউজ করুন</span></span>
            ) : (
              <span>Drag files here or <span className="text-[#0265DC] underline">browse computer</span></span>
            )}
          </p>
          <p className="text-[10px] text-[#999999] mt-0.5 leading-tight font-sans">
            {isBN 
              ? "JPEG, PNG, WEBP ফরম্যাট সমর্থিত। একসাথে ৩০টি পর্যন্ত ছবি আপলোড করে ব্যাচ প্রসেস করতে পারবেন।" 
              : "Supports JPEG, PNG, WEBP. Upload up to 30 images for fast batch processing."}
          </p>
        </div>
      </div>
    </div>
  );
}
