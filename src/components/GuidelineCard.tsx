import React, { useState } from "react";
import { ADOBE_STOCK_GUIDELINES } from "../data/guidelines";
import { HelpCircle, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

export default function GuidelineCard() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#252525] border border-[#333333] rounded-sm p-4 shadow-sm" id="guideline-card-container">
      <div className="flex items-center space-x-2 border-b border-[#333333] pb-3 mb-3">
        <HelpCircle className="w-4 h-4 text-[#0265DC]" />
        <h2 className="text-xs font-bold uppercase tracking-wide text-white">
          Adobe Stock Review Guidelines
        </h2>
      </div>

      <p className="text-xs text-[#999999] mb-4 font-sans">
        Reviewers inspect submissions at 100% zoom. Fix these technical guidelines errors before uploading to increase approval probability.
      </p>

      <div className="space-y-2.5" id="guideline-accordion">
        {ADOBE_STOCK_GUIDELINES.map((guideline, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-[#333333] rounded-sm overflow-hidden bg-[#1a1a1a] transition-all"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-3 text-left font-semibold text-[#e0e0e0] hover:bg-[#252525] transition-all focus:outline-none"
                id={`guideline-btn-${index}`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 h-5 rounded-sm bg-[#252525] border border-[#333333] flex items-center justify-center text-[10px] font-bold text-[#0265DC]">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {guideline.title}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#666666]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
                )}
              </button>

              {isOpen && (
                <div className="p-3 border-t border-[#333333] bg-[#252525]/40 space-y-3 text-xs animate-fadeIn">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-orange-400 font-bold uppercase text-[10px] tracking-wide">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Rejection Triggers</span>
                    </div>
                    <p className="text-[#999999] leading-relaxed pl-4.5">
                      {guideline.rejectionReason}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-green-400 font-bold uppercase text-[10px] tracking-wide">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Actionable Fix</span>
                    </div>
                    <p className="text-[#e0e0e0] leading-relaxed pl-4.5">
                      {guideline.solution}
                    </p>
                  </div>

                  <div className="space-y-1.5 bg-[#1e1e1e] p-2.5 border border-[#333333] rounded-sm">
                    <div className="flex items-center space-x-1 text-blue-400 font-bold uppercase text-[9px] tracking-widest">
                      <Lightbulb className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Specialist Guidelines Tips</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-[#999999] pl-1">
                      {guideline.tips.map((tip, tIndex) => (
                        <li key={tIndex} className="leading-relaxed">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
