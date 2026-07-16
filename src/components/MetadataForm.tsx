import React, { useState, useEffect } from "react";
import { Copy, Check, Plus, X, Tag, FileText, AlertTriangle, Sparkles } from "lucide-react";
import { ADOBE_STOCK_CATEGORIES } from "../data/guidelines";
import { AnalyzedImage } from "../types";

interface MetadataFormProps {
  image: AnalyzedImage | null;
  onUpdateMetadata: (id: string, updates: Partial<AnalyzedImage["adobeStockMetadata"]>) => void;
}

const FORBIDDEN_WORDS = [
  "ai",
  "midjourney",
  "dall-e",
  "stable diffusion",
  "generated",
  "photorealistic",
  "hyperdetailed",
  "masterpiece",
  "stunning",
  "4k",
  "8k",
  "ultra hd",
  "trending",
  "artstation",
];

export default function MetadataForm({ image, onUpdateMetadata }: MetadataFormProps) {
  const [newKeyword, setNewKeyword] = useState("");
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [titleWarnings, setTitleWarnings] = useState<string[]>([]);

  const metadata = image?.adobeStockMetadata;

  // Validate Title for forbidden words
  useEffect(() => {
    if (!metadata?.suggestedTitle) {
      setTitleWarnings([]);
      return;
    }

    const titleLower = metadata.suggestedTitle.toLowerCase();
    const foundWarnings = FORBIDDEN_WORDS.filter((word) => titleLower.includes(word));
    setTitleWarnings(foundWarnings);
  }, [metadata?.suggestedTitle]);

  if (!image || !metadata) {
    return (
      <div className="bg-[#252525] border border-[#333333] rounded-sm p-6 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[160px]" id="metadata-empty">
        <Tag className="w-8 h-8 text-[#666666] mb-3" />
        <h3 className="text-xs font-bold uppercase tracking-wide text-[#e0e0e0]">No Metadata Available</h3>
        <p className="text-[11px] text-[#999999] max-w-xs mt-1 leading-normal font-sans">
          Metadata will be generated automatically once you run the AI Quality Scan on an image.
        </p>
      </div>
    );
  }

  const handleCopyTitle = async () => {
    try {
      await navigator.clipboard.writeText(metadata.suggestedTitle);
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleCopyKeywords = async () => {
    try {
      const keywordsStr = metadata.suggestedKeywords.join(", ");
      await navigator.clipboard.writeText(keywordsStr);
      setCopiedKeywords(true);
      setTimeout(() => setCopiedKeywords(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newKeyword.trim().toLowerCase();
    if (!trimmed) return;

    // Split by commas to allow pasting a list of keywords
    const items = trimmed
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k && !metadata.suggestedKeywords.includes(k));

    if (items.length > 0) {
      onUpdateMetadata(image.id, {
        suggestedKeywords: [...metadata.suggestedKeywords, ...items],
      });
    }
    setNewKeyword("");
  };

  const handleRemoveKeyword = (indexToRemove: number) => {
    const updated = metadata.suggestedKeywords.filter((_, idx) => idx !== indexToRemove);
    onUpdateMetadata(image.id, { suggestedKeywords: updated });
  };

  const handleTitleChange = (val: string) => {
    onUpdateMetadata(image.id, { suggestedTitle: val });
  };

  const handleCategoryChange = (val: string) => {
    onUpdateMetadata(image.id, { category: val });
  };

  const handleToggleAI = (val: boolean) => {
    onUpdateMetadata(image.id, { isGenerativeAI: val });
  };

  const keywordCount = metadata.suggestedKeywords.length;

  return (
    <div className="bg-[#252525] border border-[#333333] rounded-sm p-4 shadow-sm space-y-4" id={`metadata-form-${image.id}`}>
      {/* Title section */}
      <div className="flex items-center space-x-2 border-b border-[#333333] pb-2 mb-2">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h2 className="text-xs font-bold uppercase tracking-wide text-white">
          Guidelines-Optimized Metadata
        </h2>
      </div>

      {/* Suggested Title Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#e0e0e0] flex items-center space-x-1">
            <FileText className="w-3.5 h-3.5 text-[#0265DC]" />
            <span>Suggested Title (descriptive & objective)</span>
          </label>
          <button
            onClick={handleCopyTitle}
            className="text-[10px] flex items-center space-x-1 text-[#e0e0e0] hover:text-white bg-[#333333] border border-[#444444] hover:bg-[#444444] px-2 py-0.5 rounded-sm"
            id={`btn-copy-title-${image.id}`}
          >
            {copiedTitle ? (
              <>
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Title</span>
              </>
            )}
          </button>
        </div>

        <input
          type="text"
          value={metadata.suggestedTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={`w-full text-xs font-mono text-[#e0e0e0] bg-[#1a1a1a] border rounded-sm p-2 focus:border-[#0265DC] focus:outline-none ${
            titleWarnings.length > 0 ? "border-[#FA0F00]/50" : "border-[#333333]"
          }`}
          id={`title-input-${image.id}`}
        />

        {/* Warning panel if forbidden words used */}
        {titleWarnings.length > 0 && (
          <div className="flex items-start space-x-1.5 p-2 rounded-sm bg-[#FA0F00]/5 border border-[#FA0F00]/15 text-[#FA0F00] text-[10px] leading-relaxed">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold uppercase tracking-wide mr-1">Submission Rules Warning:</span> Adobe Stock forbids metadata that contains quality descriptive terms. Please remove:{" "}
              <span className="font-mono bg-[#1a1a1a] px-1 py-0.5 rounded-sm text-[10px] font-bold border border-[#FA0F00]/35 text-white">
                {titleWarnings.join(", ")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Category Selection & Generative AI check */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold text-[#999999] uppercase tracking-wide">
            Recommended Category
          </label>
          <select
            value={metadata.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full text-xs text-[#e0e0e0] bg-[#1a1a1a] border border-[#333333] rounded-sm p-2 focus:border-[#0265DC] focus:outline-none"
            id={`category-select-${image.id}`}
          >
            {ADOBE_STOCK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold text-[#999999] uppercase tracking-wide block">
            Generative AI Declaration
          </label>
          <div className="flex items-center space-x-2 bg-[#1a1a1a] border border-[#333333] rounded-sm p-2 h-[34px]">
            <input
              type="checkbox"
              id={`ai-declare-checkbox-${image.id}`}
              checked={metadata.isGenerativeAI}
              onChange={(e) => handleToggleAI(e.target.checked)}
              className="w-3.5 h-3.5 rounded-sm border-[#333333] text-[#0265DC] focus:ring-[#0265DC] bg-[#252525]"
            />
            <label
              htmlFor={`ai-declare-checkbox-${image.id}`}
              className="text-[11px] text-[#e0e0e0] cursor-pointer select-none font-medium"
            >
              Created with Generative AI tools
            </label>
          </div>
        </div>
      </div>

      {/* Keywords / Tags section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#333333] pb-2">
          <div className="flex items-center space-x-1.5">
            <Tag className="w-3.5 h-3.5 text-[#0265DC]" />
            <span className="text-xs font-bold text-[#e0e0e0]">
              Keywords Tag Cloud
            </span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm font-bold border ${
                keywordCount > 50 || keywordCount < 5
                  ? "bg-[#FA0F00]/10 text-[#FA0F00] border-[#FA0F00]/25"
                  : "bg-green-950/20 text-green-400 border-green-900/30"
              }`}
            >
              {keywordCount} / 50 Tags
            </span>
          </div>

          <button
            onClick={handleCopyKeywords}
            className="text-[10px] flex items-center space-x-1 text-[#e0e0e0] hover:text-white bg-[#333333] border border-[#444444] hover:bg-[#444444] px-2 py-0.5 rounded-sm"
            id={`btn-copy-keywords-${image.id}`}
          >
            {copiedKeywords ? (
              <>
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Tags</span>
              </>
            )}
          </button>
        </div>

        {/* Add keyword form */}
        <form onSubmit={handleAddKeyword} className="flex space-x-1.5">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Add tag or paste comma-separated list..."
            className="flex-1 text-xs text-[#e0e0e0] bg-[#1a1a1a] border border-[#333333] rounded-sm px-2.5 py-1.5 focus:border-[#0265DC] focus:outline-none"
            id={`tag-input-field-${image.id}`}
          />
          <button
            type="submit"
            className="px-2.5 bg-[#0265DC] hover:bg-[#0052b4] text-white rounded-sm transition-all text-xs"
            id={`btn-add-tag-${image.id}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-1 p-2 bg-[#1a1a1a] border border-[#333333] rounded-sm min-h-[140px] max-h-[220px] overflow-y-auto" id="tag-cloud-scrollable">
          {metadata.suggestedKeywords.map((tag, idx) => (
            <div
              key={idx}
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-sm bg-[#252525] text-[#e0e0e0] border border-[#333333] text-[10px] font-sans hover:border-[#444444] transition-colors"
            >
              <span className="font-mono text-[9px] text-[#0265DC] font-bold mr-0.5">
                {idx + 1}
              </span>
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveKeyword(idx)}
                className="text-[#666666] hover:text-[#FA0F00] transition-colors p-0.5"
                id={`btn-remove-tag-${idx}-${image.id}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}

          {keywordCount === 0 && (
            <div className="w-full flex items-center justify-center h-full text-[#666666] text-[11px] py-10 italic">
              No tags loaded. Run AI diagnostics to output suggested keywords.
            </div>
          )}
        </div>
        <p className="text-[10px] text-[#666666] leading-tight">
          *Note: Adobe Stock sorts tags by relevance. Ensure your first 10 keywords represent the core context.
        </p>
      </div>
    </div>
  );
}
