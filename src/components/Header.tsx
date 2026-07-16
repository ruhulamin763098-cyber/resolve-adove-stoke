import React from "react";
import { Sparkles, HelpCircle, BookOpen } from "lucide-react";

interface HeaderProps {
  onToggleHelp: () => void;
  showHelp: boolean;
}

export default function Header({ onToggleHelp, showHelp }: HeaderProps) {
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
            High-Density Quality Check & Metadata Assistant
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
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
          <span>{showHelp ? "Hide Guidelines" : "Adobe Guidelines"}</span>
        </button>
      </div>
    </header>
  );
}
