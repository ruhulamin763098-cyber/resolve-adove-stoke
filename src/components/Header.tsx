import React from "react";
import { Sparkles, HelpCircle, BookOpen } from "lucide-react";

interface HeaderProps {
  onToggleHelp: () => void;
  showHelp: boolean;
  lang: "bn" | "en";
  onChangeLang: (lang: "bn" | "en") => void;
  imagesCount: number;
}

export default function Header({ onToggleHelp, showHelp, lang, onChangeLang, imagesCount }: HeaderProps) {
  const isBN = lang === "bn";
  return (
    <header className="bg-[#252525] border-b border-[#333333] px-5 py-3 sticky top-0 z-10 flex items-center justify-between" id="app-header">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-[#FA0F00] rounded-sm flex items-center justify-center font-bold text-white text-xs shadow-sm">
          St
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            Adobe Stock <span className="text-[#999999] font-normal">Resolver Pro</span>
          </h1>
          <p className="text-[10px] font-mono text-[#666666]">
            {lang === "bn" ? "হাই-ডেনসিটি কোয়ালিটি চেক ও মেটাডেটা অ্যাসিস্ট্যান্ট" : "High-Density Quality Check & Metadata Assistant"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3.5">
        {/* Dynamic 30-slots counter badge */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-[#FA0F00]/10 border border-[#FA0F00]/20 px-2.5 py-1 rounded-sm text-xs" id="slots-badge">
          <Sparkles className="w-3.5 h-3.5 text-[#FA0F00] animate-pulse" />
          <span className="text-[11px] font-bold text-[#e0e0e0] font-sans">
            {isBN 
              ? `৩০টি স্লট: ${imagesCount}/৩০ আপলোড করা হয়েছে` 
              : `30 Slots: ${imagesCount}/30 uploaded`}
          </span>
        </div>
        {/* Language selector segmented control */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-sm p-0.5 flex items-center space-x-0.5" id="language-selector">
          <button
            onClick={() => onChangeLang("bn")}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-sm transition-all focus:outline-none ${
              lang === "bn"
                ? "bg-[#0265DC] text-white"
                : "text-[#999999] hover:text-[#e0e0e0]"
            }`}
            id="btn-lang-bn"
          >
            বাংলা
          </button>
          <button
            onClick={() => onChangeLang("en")}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-sm transition-all focus:outline-none ${
              lang === "en"
                ? "bg-[#0265DC] text-white"
                : "text-[#999999] hover:text-[#e0e0e0]"
            }`}
            id="btn-lang-en"
          >
            EN
          </button>
        </div>

        <button
          onClick={onToggleHelp}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-medium border transition-all ${
            showHelp
              ? "bg-[#0265DC] border-[#0265DC] text-white shadow-sm"
              : "bg-[#333333] border-[#444444] text-[#e0e0e0] hover:bg-[#444444] hover:text-white"
          }`}
          id="btn-toggle-help"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>
            {showHelp 
              ? (lang === "bn" ? "গাইডলাইন বন্ধ করুন" : "Hide Guidelines") 
              : (lang === "bn" ? "অ্যাডোবি গাইডলাইন" : "Adobe Guidelines")}
          </span>
        </button>
      </div>
    </header>
  );
}
