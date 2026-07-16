import React from "react";
import { Image as ImageIcon, Trash2, RefreshCw, CheckCircle, AlertTriangle, Play, HelpCircle } from "lucide-react";
import { AnalyzedImage } from "../types";

interface BatchListProps {
  images: AnalyzedImage[];
  selectedImageId: string | null;
  onSelectImage: (id: string) => void;
  onRemoveImage: (id: string) => void;
  onAnalyzeImage: (id: string) => void;
}

export default function BatchList({
  images,
  selectedImageId,
  onSelectImage,
  onRemoveImage,
  onAnalyzeImage,
}: BatchListProps) {
  const getStatusBadge = (image: AnalyzedImage) => {
    switch (image.status) {
      case "idle":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-[#333333] text-[#999999] border border-[#444444]">
            Ready
          </span>
        );
      case "analyzing":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-[#0265DC]/10 text-blue-400 border border-[#0265DC]/20 animate-pulse">
            <RefreshCw className="w-2.5 h-2.5 mr-1 animate-spin" />
            Analyzing
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-[#FA0F00]/10 text-[#FA0F00] border border-[#FA0F00]/20">
            <AlertTriangle className="w-2.5 h-2.5 mr-1" />
            Error
          </span>
        );
      case "completed":
        const rate = image.acceptanceRate || 0;
        let color = "text-emerald-400 bg-emerald-950/20 border border-emerald-900/30";
        if (rate < 70 && rate >= 40) {
          color = "text-amber-400 bg-amber-950/20 border border-amber-900/30";
        } else if (rate < 40) {
          color = "text-[#FA0F00] bg-[#FA0F00]/10 border border-[#FA0F00]/20";
        }
        return (
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium ${color}`}>
            <CheckCircle className="w-2.5 h-2.5 mr-1" />
            {rate}% Pass
          </span>
        );
    }
  };

  const getFileSizeString = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="bg-[#252525] border border-[#333333] rounded-sm p-3 shadow-sm flex flex-col h-full" id="batch-list-container">
      <div className="flex items-center justify-between border-b border-[#333333] pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-[#0265DC]" />
          <h2 className="text-xs font-bold uppercase tracking-wide text-white">
            Upload Queue ({images.length})
          </h2>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 px-2 text-center">
          <ImageIcon className="w-6 h-6 text-[#444444] mb-2" />
          <p className="text-[11px] text-[#666666] font-sans">
            No images in workspace queue.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[480px] md:max-h-[580px]" id="queue-scrollable">
          {images.map((image) => {
            const isSelected = selectedImageId === image.id;
            return (
              <div
                key={image.id}
                onClick={() => onSelectImage(image.id)}
                className={`flex items-center justify-between p-2 rounded-sm border cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#0265DC] bg-[#2d2d2d] border-l-4"
                    : "border-[#333333] bg-[#1a1a1a] hover:border-[#444444] hover:bg-[#252525]"
                }`}
                id={`queue-item-${image.id}`}
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 rounded-sm bg-[#111111] border border-[#333333] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      src={image.dataUrl}
                      alt={image.filename}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate" title={image.filename}>
                      {image.filename}
                    </p>
                    <p className="text-[9px] font-mono text-[#666666] mt-0.5">
                      {getFileSizeString(image.fileSize)}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      {getStatusBadge(image)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 pl-1">
                  {image.status === "idle" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnalyzeImage(image.id);
                      }}
                      className="p-1 rounded bg-[#333333] border border-[#444444] text-[#0265DC] hover:bg-[#0265DC] hover:text-white transition-all"
                      title="Analyze"
                      id={`btn-analyze-${image.id}`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  )}
                  {image.status === "error" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnalyzeImage(image.id);
                      }}
                      className="p-1 rounded bg-[#333333] border border-[#444444] text-white hover:bg-slate-700 transition-all"
                      title="Retry"
                      id={`btn-retry-${image.id}`}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(image.id);
                    }}
                    className="p-1 rounded bg-[#111111] border border-[#333333] text-[#666666] hover:bg-[#FA0F00]/10 hover:text-[#FA0F00] transition-all"
                    title="Remove"
                    id={`btn-remove-${image.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
