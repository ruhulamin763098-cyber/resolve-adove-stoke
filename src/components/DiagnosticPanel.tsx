import React from "react";
import { AnalyzedImage } from "../types";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Settings,
  ShieldAlert,
  Info,
  Wrench,
  PenSquare,
  Download,
  Sparkles
} from "lucide-react";

interface DiagnosticPanelProps {
  image: AnalyzedImage | null;
  onAnalyze: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  lang: "bn" | "en";
  onUpscale?: (id: string) => void;
  isUpscaling?: boolean;
}

export default function DiagnosticPanel({
  image,
  onAnalyze,
  onUpdateNotes,
  lang,
  onUpscale,
  isUpscaling = false,
}: DiagnosticPanelProps) {
  const isBN = lang === "bn";

  if (!image) {
    return (
      <div className="bg-[#252525] border border-[#333333] rounded-sm p-6 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[300px]" id="diagnostic-empty">
        <ShieldAlert className="w-10 h-10 text-[#666666] mb-3" />
        <h3 className="text-xs font-bold uppercase tracking-wide text-[#e0e0e0]">
          {isBN ? "কোনো ইমেজ সিলেক্ট করা হয়নি" : "No Image Selected"}
        </h3>
        <p className="text-[11px] text-[#999999] max-w-xs mt-1 leading-normal font-sans">
          {isBN 
            ? "কারিগরি ত্রুটি পরীক্ষা করতে, রিজেকশন ঝুঁকি যাচাই করতে এবং কিওয়ার্ড অপ্টিমাইজ করতে কিউ থেকে একটি ইমেজ সিলেক্ট করুন।" 
            : "Select an asset from the queue to run technical diagnostics, analyze rejection triggers, and optimize tags."}
        </p>
      </div>
    );
  }

  const getAcceptanceLabel = (rate: number) => {
    if (rate >= 85) {
      return { 
        text: isBN ? "পাস হওয়ার উচ্চ সম্ভাবনা" : "High Probability Pass", 
        color: "text-green-400 bg-green-950/20 border-green-900/30" 
      };
    }
    if (rate >= 70) {
      return { 
        text: isBN ? "পাস হওয়ার স্বাভাবিক সম্ভাবনা" : "Standard Pass Probability", 
        color: "text-emerald-400 bg-emerald-950/10 border-emerald-900/20" 
      };
    }
    if (rate >= 50) {
      return { 
        text: isBN ? "মাঝারি রিজেকশন ঝুঁকি" : "Moderate Rejection Risk", 
        color: "text-amber-400 bg-amber-950/20 border-amber-900/30" 
      };
    }
    return { 
      text: isBN ? "উচ্চ রিজেকশন ঝুঁকি" : "High Rejection Risk", 
      color: "text-[#FA0F00] bg-[#FA0F00]/10 border-[#FA0F00]/20" 
    };
  };

  const getRiskColor = (level: "Low" | "Medium" | "High") => {
    switch (level) {
      case "High":
        return "text-[#FA0F00] bg-[#FA0F00]/10 border-[#FA0F00]/20";
      case "Medium":
        return "text-amber-400 bg-amber-950/20 border-amber-900/30";
      case "Low":
        return "text-green-400 bg-green-950/20 border-green-900/30";
    }
  };

  const translateRiskLevel = (level: string) => {
    if (!isBN) return `${level} Risk`;
    switch (level) {
      case "High": return "উচ্চ ঝুঁকি";
      case "Medium": return "মাঝারি ঝুঁকি";
      case "Low": return "কম ঝুঁকি";
      default: return level;
    }
  };

  const getStatusIcon = (status: "Pass" | "Warn" | "Fail") => {
    switch (status) {
      case "Pass":
        return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
      case "Warn":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case "Fail":
        return <XCircle className="w-3.5 h-3.5 text-[#FA0F00]" />;
    }
  };

  const getStatusRowBg = (status: "Pass" | "Warn" | "Fail") => {
    switch (status) {
      case "Pass":
        return "bg-green-950/5 border-green-950/15";
      case "Warn":
        return "bg-amber-950/5 border-amber-950/15";
      case "Fail":
        return "bg-[#FA0F00]/5 border-[#FA0F00]/15";
    }
  };

  return (
    <div className="bg-[#252525] border border-[#333333] rounded-sm p-4 shadow-sm space-y-4 overflow-y-auto max-h-[1100px]" id={`diagnostic-panel-${image.id}`}>
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#333333] pb-3 gap-3">
        <div className="min-w-0">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white truncate animate-fadeIn" title={image.filename}>
            {image.filename}
          </h2>
          <p className="text-[10px] text-[#999999] font-mono mt-0.5">
            {isBN ? "কারিগরি ডায়াগনস্টিক ও রিজেকশন সমাধান" : "Technical Diagnosis & Rejection Mitigator"}
          </p>
        </div>

        {image.status === "idle" && (
          <button
            onClick={() => onAnalyze(image.id)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0265DC] hover:bg-[#0052b4] text-white rounded-sm text-xs font-semibold shadow-sm transition-all self-start"
            id={`btn-start-eval-${image.id}`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isBN ? "AI কোয়ালিটি স্ক্যান" : "AI Quality Scan"}</span>
          </button>
        )}

        {image.status === "completed" && onUpscale && (
          <button
            onClick={() => onUpscale(image.id)}
            disabled={isUpscaling}
            className={`flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-sm text-xs font-bold shadow-sm transition-all self-start cursor-pointer ${
              isUpscaling ? "opacity-60 cursor-not-allowed" : ""
            }`}
            id={`btn-upscale-${image.id}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>
              {isUpscaling 
                ? (isBN ? "আপস্কেল হচ্ছে..." : "Upscaling...") 
                : (isBN ? "২x আপস্কেল ও সমাধান করুন" : "2x Upscale & Auto-Fix")}
            </span>
          </button>
        )}
      </div>

      {/* Main Image Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Preview Container */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="relative w-full aspect-video sm:aspect-square bg-[#1a1a1a] border border-[#333333] rounded-sm overflow-hidden flex items-center justify-center">
            <img
              src={image.dataUrl}
              alt={image.filename}
              className="object-contain max-h-full max-w-full w-full h-full"
            />
            <div className="absolute top-2 left-2 bg-[#111111]/90 px-1.5 py-0.5 rounded-sm text-[9px] font-mono text-[#999999] border border-[#333333]">
              {isBN ? "প্রিভিউ" : "PREVIEW"}
            </div>

            <a
              href={image.dataUrl}
              download={image.filename}
              className="absolute bottom-2 right-2 flex items-center space-x-1 px-2 py-1 bg-[#111111]/90 hover:bg-[#0265DC] text-[#e0e0e0] hover:text-white rounded-sm text-[10px] font-semibold border border-[#333333] hover:border-transparent transition-all shadow-md cursor-pointer"
              title={isBN ? "ইমেজ ডাউনলোড করুন" : "Download Image"}
              id={`btn-download-preview-${image.id}`}
            >
              <Download className="w-3 h-3" />
              <span>{isBN ? "ডাউনলোড" : "Download"}</span>
            </a>
          </div>

          {/* Notes / User Instructions */}
          <div className="bg-[#1a1a1a] border border-[#333333] rounded-sm p-2.5">
            <div className="flex items-center space-x-1 text-white text-xs font-semibold mb-1.5">
              <PenSquare className="w-3.5 h-3.5 text-[#0265DC]" />
              <span>{isBN ? "ডায়াগনস্টিক নোট" : "Diagnostic Notes"}</span>
            </div>
            <textarea
              value={image.customNotes || ""}
              onChange={(e) => onUpdateNotes(image.id, e.target.value)}
              placeholder={isBN 
                ? "যেমন: 'আমি ইমেজ আপস্কেলার ব্যবহার করেছি' অথবা 'এটিতে কালার ব্যান্ডিং সমস্যা থাকতে পারে, রিজেকশন ঝুঁকি চেক করুন'।"
                : "e.g. 'I used upscaling tool' or 'This image has flat gradient sky, inspect for color banding rejections'."}
              className="w-full text-xs text-[#e0e0e0] bg-[#252525] border border-[#333333] rounded-sm p-2 focus:border-[#0265DC] focus:outline-none resize-none h-14 placeholder-[#666666]"
              id={`notes-textarea-${image.id}`}
            />
          </div>
        </div>

        {/* AI Results Output */}
        <div className="lg:col-span-7 space-y-4">
          {image.status === "idle" && (
            <div className="bg-[#1a1a1a] border border-[#333333] rounded-sm p-6 flex flex-col items-center justify-center text-center h-full min-h-[160px]">
              <Settings className="w-8 h-8 text-[#0265DC]/80 mb-2 animate-spin-slow" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {isBN ? "বিশ্লেষণ পেন্ডিং" : "Analysis Pending"}
              </h4>
              <p className="text-[11px] text-[#999999] max-w-xs mt-1 leading-normal">
                {isBN 
                  ? "অ্যাডোবি স্টক গাইডলাইন অনুযায়ী পিক্সেলের মান পরীক্ষা করতে 'AI কোয়ালিটি স্ক্যান' বাটনে ক্লিক করুন।"
                  : "Click \"AI Quality Scan\" to analyze pixel properties against Adobe Stock guidelines."}
              </p>
            </div>
          )}

          {image.status === "analyzing" && (
            <div className="bg-[#1a1a1a] border border-[#333333] rounded-sm p-6 flex flex-col items-center justify-center text-center h-full min-h-[160px]">
              <div className="relative w-8 h-8 mb-3">
                <div className="absolute inset-0 rounded-full border-2 border-[#333333]"></div>
                <div className="absolute inset-0 rounded-full border-2 border-[#0265DC] border-t-transparent animate-spin"></div>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white animate-pulse">
                {isBN ? "পিক্সেল স্ক্যান করা হচ্ছে" : "Scanning Pixels"}
              </h4>
              <p className="text-[11px] text-[#999999] max-w-xs mt-1 leading-normal">
                {isBN 
                  ? "ক্রোম্যাটিক অ্যাবারেশন, সফ্ট ফোকাস, কম্প্রেশন নয়েজ ও ভিজ্যুয়াল ত্রুটি পরীক্ষা করা হচ্ছে..."
                  : "Testing chromatic aberration, focus soft spots, compression, and visual glitches..."}
              </p>
            </div>
          )}

          {image.status === "error" && (
            <div className="bg-[#1a1a1a] border border-[#333333] rounded-sm p-6 flex flex-col items-center justify-center text-center h-full min-h-[160px]">
              <XCircle className="w-8 h-8 text-[#FA0F00] mb-2" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {isBN ? "স্ক্যান ব্যর্থ হয়েছে" : "Scan Failed"}
              </h4>
              <p className="text-[11px] text-[#FA0F00] bg-[#FA0F00]/5 border border-[#FA0F00]/20 rounded-sm p-2 my-2 break-all font-mono">
                {image.error || "An error occurred during evaluation."}
              </p>
              <button
                onClick={() => onAnalyze(image.id)}
                className="px-3 py-1 bg-[#333333] text-white text-xs font-semibold rounded-sm hover:bg-[#444444] border border-[#444444]"
              >
                {isBN ? "আবার চেষ্টা করুন" : "Retry Scan"}
              </button>
            </div>
          )}

          {image.status === "completed" && (
            <div className="space-y-4 animate-fadeIn" id={`diagnostic-results-${image.id}`}>
              {image.usedFallback && (
                <div className="p-2.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold">
                      {isBN ? "অফলাইন ডায়াগনস্টিক সক্রিয়" : "High-Fidelity Backup Enabled"}
                    </span>: {isBN 
                      ? "জেমিনি এপিআই কোটা লিমিটের কারণে আপনার ইমেজের জন্য অফলাইন কোয়ালিটি স্ক্যান করা হয়েছে। আপনি এখনও ২x আপস্কেল এবং সমাধান করতে পারবেন!"
                      : "Due to Gemini API rate limits, a high-fidelity local quality scan was performed. You can still 2x upscale, solve, and export!"}
                  </div>
                </div>
              )}

              {/* Acceptance Level and Technical Score cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Score Circular Meter */}
                <div className="bg-[#1a1a1a] border border-[#333333] p-3 rounded-sm flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-mono text-[#999999] uppercase tracking-wider">
                    {isBN ? "গ্রহণের সম্ভাবনা" : "Acceptance Chance"}
                  </span>
                  <div className="relative flex items-center justify-center my-2">
                    <svg className="w-16 h-16">
                      <circle
                        className="text-[#333333]"
                        strokeWidth="5"
                        stroke="currentColor"
                        fill="transparent"
                        r="25"
                        cx="32"
                        cy="32"
                      />
                      <circle
                        className={
                          (image.acceptanceRate || 0) >= 85
                            ? "text-green-500"
                            : (image.acceptanceRate || 0) >= 60
                            ? "text-amber-500"
                            : "text-[#FA0F00]"
                        }
                        strokeWidth="5"
                        strokeDasharray={2 * Math.PI * 25}
                        strokeDashoffset={2 * Math.PI * 25 * (1 - (image.acceptanceRate || 0) / 100)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="25"
                        cx="32"
                        cy="32"
                        transform="rotate(-90 32 32)"
                      />
                    </svg>
                    <span className="absolute text-sm font-bold text-white">
                      {image.acceptanceRate}%
                    </span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wide border ${
                      getAcceptanceLabel(image.acceptanceRate || 0).color
                    }`}
                  >
                    {getAcceptanceLabel(image.acceptanceRate || 0).text}
                  </span>
                </div>

                {/* Technical Score */}
                <div className="bg-[#1a1a1a] border border-[#333333] p-3 rounded-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-[#999999] uppercase tracking-wider block">
                      {isBN ? "কোয়ালিটি রেটিং" : "Quality Rating"}
                    </span>
                    <div className="flex items-baseline mt-1">
                      <span className="text-2xl font-bold text-white">
                        {image.overallQualityScore}
                      </span>
                      <span className="text-[10px] text-[#666666] font-mono ml-0.5">/10</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-[#333333] rounded-none h-1 overflow-hidden">
                      <div
                        className={`h-full ${
                          (image.overallQualityScore || 0) >= 8
                            ? "bg-green-500"
                            : (image.overallQualityScore || 0) >= 6
                            ? "bg-amber-500"
                            : "bg-[#FA0F00]"
                        }`}
                        style={{ width: `${(image.overallQualityScore || 0) * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] text-[#666666] mt-1 block leading-tight">
                      {isBN ? "১০/১০ পেতে চিহ্নিত ত্রুটিগুলো সমাধান করুন।" : "Fix identified flags to hit 10/10 target."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              {image.rejectionChecklist && image.rejectionChecklist.length > 0 && (
                <div className="bg-[#1a1a1a] border border-[#333333] rounded-sm p-3">
                  <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider mb-2">
                    {isBN ? "নিয়ম-ভিত্তিক কমপ্লায়েন্স চেক" : "Rule-Based Compliance Checks"}
                  </h3>
                  <div className="space-y-1.5">
                    {image.rejectionChecklist.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-start justify-between p-2 border rounded-sm ${getStatusRowBg(
                          item.status
                        )}`}
                      >
                        <div className="flex items-start space-x-2 min-w-0">
                          <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-white leading-tight">
                              {item.item}
                            </h4>
                            <p className="text-[10px] text-[#999999] mt-0.5 leading-snug">
                              {item.comment}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1 py-0.5 rounded-sm border flex-shrink-0 ${
                            item.status === "Pass"
                              ? "bg-green-950/20 text-green-400 border-green-900/30"
                              : item.status === "Warn"
                              ? "bg-amber-950/20 text-amber-400 border-amber-900/30"
                              : "bg-[#FA0F00]/20 text-[#FA0F00] border-[#FA0F00]/30"
                          }`}
                        >
                          {item.status === "Pass" ? (isBN ? "পাস" : "Pass") : item.status === "Warn" ? (isBN ? "সতর্কতা" : "Warn") : (isBN ? "ব্যর্থ" : "Fail")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rejection Risks & Remedies Section */}
      {image.status === "completed" && image.rejectionRisks && image.rejectionRisks.length > 0 && (
        <div className="bg-[#1a1a1a]/55 border border-[#333333] p-3 rounded-sm space-y-3" id={`rejection-remedies-${image.id}`}>
          <div className="flex items-center space-x-1.5 border-b border-[#333333] pb-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#0265DC]" />
            <h3 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
              {isBN ? "চিহ্নিত ঝুঁকি এবং এডোবি গাইডলাইন সমাধান" : "Diagnosed Risks & Adobe Guidelines Workarounds"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {image.rejectionRisks.map((risk, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] border border-[#333333] p-2.5 rounded-sm space-y-1.5 animate-fadeIn"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {risk.category}
                  </span>
                  <span
                    className={`text-[8px] font-mono font-bold uppercase tracking-wide px-1 py-0.5 border rounded-sm ${getRiskColor(
                      risk.riskLevel
                    )}`}
                  >
                    {translateRiskLevel(risk.riskLevel)}
                  </span>
                </div>
                <p className="text-[11px] text-[#999999] leading-snug">
                  <span className="text-[#e0e0e0] font-semibold">{isBN ? "ত্রুটি:" : "Issue:"}</span> {risk.description}
                </p>
                <div className="mt-1.5 pt-1.5 border-t border-[#333333] flex items-start space-x-1.5 text-[#0265DC]">
                  <Wrench className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] leading-snug text-[#0265DC]">
                    <span className="font-bold uppercase text-[9px] tracking-wide text-[#e0e0e0] mr-1">{isBN ? "সমাধান:" : "Workaround:"}</span>{risk.remedy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
