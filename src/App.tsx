import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ImageDropzone from "./components/ImageDropzone";
import BatchList from "./components/BatchList";
import DiagnosticPanel from "./components/DiagnosticPanel";
import MetadataForm from "./components/MetadataForm";
import GuidelineCard from "./components/GuidelineCard";
import { AnalyzedImage } from "./types";
import { exportToAdobeStockCSV } from "./utils/csv";
import {
  Download,
  Trash2,
  Sparkles,
  Play,
  HelpCircle,
  FileSpreadsheet,
  Layers,
  CheckCircle,
  Info
} from "lucide-react";

// Pre-loaded abstract SVG gradients as Demo Images to test the app instantly!
const DEMO_IMAGES = [
  {
    name: "eco_futuristic_cityscape.jpg",
    title: "Eco Futuristic Cityscape with Green Gardens and Solar Rails",
    notes: "AI-generated cityscape. Check for weird floating particles, anatomical errors in walking crowds, and generic brand logos.",
    gradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g1)" />
      <circle cx="400" cy="450" r="180" fill="none" stroke="#ffffff" stroke-width="8" opacity="0.15" />
      <polygon points="150,600 300,350 450,600" fill="#065f46" opacity="0.3" />
      <polygon points="350,600 500,280 650,600" fill="#047857" opacity="0.3" />
      <line x1="100" y1="600" x2="700" y2="600" stroke="#ffffff" stroke-width="4" opacity="0.4" />
      <text x="400" y="380" font-family="system-ui" font-size="32" font-weight="bold" fill="#ffffff" text-anchor="middle" opacity="0.7">ECO CITY TECH</text>
    </svg>`
  },
  {
    name: "cozy_workstation_ambient.jpg",
    title: "Cozy Home Office Workstation with Warm Aesthetic Lights",
    notes: "Aesthetic office workspace. Look for weird warped keyboard keys, duplicate mouse scrollwheels, and potential Apple keyboard brand copycats.",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #6366f1 100%)",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#6366f1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g2)" />
      <rect x="250" y="200" width="300" height="200" rx="10" fill="#1e1b4b" opacity="0.5" />
      <rect x="200" y="500" width="400" height="30" rx="5" fill="#312e81" opacity="0.4" />
      <circle cx="400" cy="120" r="40" fill="#fef08a" opacity="0.3" />
      <text x="400" y="310" font-family="system-ui" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle" opacity="0.6">AMBIENT CABIN</text>
    </svg>`
  },
  {
    name: "fitness_trainer_portrait.jpg",
    title: "Athletic Portrait of Female Fitness Coach in Modern Gym",
    notes: "Gym setting. Inspect carefully for hand distortions (too many fingers), gym machinery logo violations, and facial symmetry.",
    gradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ec4899" />
          <stop offset="100%" stop-color="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g3)" />
      <circle cx="400" cy="350" r="100" fill="#fdf2f8" opacity="0.2" />
      <polygon points="300,550 500,550 480,450 320,450" fill="#4c1d95" opacity="0.3" />
      <text x="400" y="360" font-family="system-ui" font-size="32" font-weight="bold" fill="#ffffff" text-anchor="middle" opacity="0.75">ATHLETIC BODY</text>
    </svg>`
  }
];

export default function App() {
  const [images, setImages] = useState<AnalyzedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isBulkAnalyzing, setIsBulkAnalyzing] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Load state from local storage on startup
  useEffect(() => {
    const saved = localStorage.getItem("adobe_stock_solver_queue");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setImages(parsed);
        if (parsed.length > 0) {
          setSelectedImageId(parsed[0].id);
        }
      } catch (err) {
        console.error("Failed to parse saved state", err);
      }
    }
  }, []);

  // Save state to local storage when images update
  const saveToLocalStorage = (updatedImages: AnalyzedImage[]) => {
    localStorage.setItem("adobe_stock_solver_queue", JSON.stringify(updatedImages));
  };

  const handleImagesAdded = (newImages: Omit<AnalyzedImage, "status">[]) => {
    const initialized: AnalyzedImage[] = newImages.map((img) => ({
      ...img,
      status: "idle",
      customNotes: "",
    }));

    const combined = [...images, ...initialized];
    setImages(combined);
    saveToLocalStorage(combined);

    if (!selectedImageId && combined.length > 0) {
      setSelectedImageId(combined[0].id);
    }
    setGeneralError(null);
  };

  const handleRemoveImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    setImages(filtered);
    saveToLocalStorage(filtered);

    if (selectedImageId === id) {
      setSelectedImageId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const handleClearQueue = () => {
    if (window.confirm("Are you sure you want to clear your entire upload queue?")) {
      setImages([]);
      setSelectedImageId(null);
      localStorage.removeItem("adobe_stock_solver_queue");
    }
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = images.map((img) =>
      img.id === id ? { ...img, customNotes: notes } : img
    );
    setImages(updated);
    saveToLocalStorage(updated);
  };

  const handleUpdateMetadata = (
    id: string,
    updates: Partial<AnalyzedImage["adobeStockMetadata"]>
  ) => {
    const updated = images.map((img) => {
      if (img.id === id && img.adobeStockMetadata) {
        return {
          ...img,
          adobeStockMetadata: {
            ...img.adobeStockMetadata,
            ...updates,
          } as any,
        };
      }
      return img;
    });
    setImages(updated);
    saveToLocalStorage(updated);
  };

  // Run analysis for a single image
  const handleAnalyzeImage = async (id: string) => {
    const imgToAnalyze = images.find((img) => img.id === id);
    if (!imgToAnalyze) return;

    // Set to analyzing
    const updated1 = images.map((img) =>
      img.id === id ? { ...img, status: "analyzing" as const } : img
    );
    setImages(updated1);

    try {
      // Remove dataUrl header (e.g. "data:image/png;base64,") before sending to API
      const base64Data = imgToAnalyze.dataUrl.split(",")[1];

      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: imgToAnalyze.mimeType,
          filename: imgToAnalyze.filename,
          customNotes: imgToAnalyze.customNotes,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Server failed to process the image.");
      }

      const diagnosticData = await res.json();

      const updated2 = images.map((img) => {
        if (img.id === id) {
          return {
            ...img,
            status: "completed" as const,
            acceptanceRate: diagnosticData.acceptanceRate,
            overallQualityScore: diagnosticData.overallQualityScore,
            rejectionRisks: diagnosticData.rejectionRisks,
            adobeStockMetadata: diagnosticData.adobeStockMetadata,
            rejectionChecklist: diagnosticData.rejectionChecklist,
          };
        }
        return img;
      });

      setImages(updated2);
      saveToLocalStorage(updated2);
    } catch (err: any) {
      console.error("Evaluation error", err);
      const updatedError = images.map((img) =>
        img.id === id
          ? {
              ...img,
              status: "error" as const,
              error: err.message || "Failed to contact analysis server.",
            }
          : img
      );
      setImages(updatedError);
      saveToLocalStorage(updatedError);
    }
  };

  // Run analysis for all idle images sequentially
  const handleBulkAnalyze = async () => {
    const idleImages = images.filter((img) => img.status === "idle" || img.status === "error");
    if (idleImages.length === 0) return;

    setIsBulkAnalyzing(true);
    setGeneralError(null);

    for (let i = 0; i < idleImages.length; i++) {
      const current = idleImages[i];
      // Set select so user sees the progress visually
      setSelectedImageId(current.id);
      await handleAnalyzeImage(current.id);
    }

    setIsBulkAnalyzing(false);
  };

  // Handles exporting to Adobe Stock CSV
  const handleExportCSV = () => {
    const success = exportToAdobeStockCSV(images);
    if (!success) {
      setGeneralError("No analyzed images found. Run the AI check on at least one image before exporting.");
    } else {
      setGeneralError(null);
    }
  };

  // Generates offline demo assets so they can try it instantly
  const handleLoadDemo = () => {
    const demos: Omit<AnalyzedImage, "status">[] = DEMO_IMAGES.map((demo) => {
      // Encode the custom SVG template to base64
      const base64Svg = btoa(unescape(encodeURIComponent(demo.svg)));
      const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

      return {
        id: crypto.randomUUID(),
        filename: demo.name,
        dataUrl,
        fileSize: demo.svg.length,
        mimeType: "image/svg+xml",
        customNotes: demo.notes,
      };
    });

    handleImagesAdded(demos);
  };

  const selectedImage = images.find((img) => img.id === selectedImageId) || null;
  const completedCount = images.filter((img) => img.status === "completed").length;
  const pendingCount = images.filter((img) => img.status === "idle").length;

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#e0e0e0] flex flex-col selection:bg-[#0265DC] selection:text-white" id="app-root-container">
      {/* Sleek top header */}
      <Header onToggleHelp={() => setShowHelp(!showHelp)} showHelp={showHelp} />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Hand: Queue list and controls (Col span 4) */}
        <section className="lg:col-span-4 flex flex-col space-y-3.5 h-full" id="workspace-sidebar">
          {/* File input drag and drop card */}
          <ImageDropzone onImagesAdded={handleImagesAdded} />

          {/* Preset generator for testing */}
          {images.length === 0 && (
            <div className="bg-[#252525] border border-[#333333] rounded-sm p-3 text-center space-y-2.5">
              <span className="text-[11px] text-[#999999] block font-sans">
                Don't have an image ready? Try our preset samples:
              </span>
              <button
                onClick={handleLoadDemo}
                className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-[#333333] hover:bg-[#444444] text-[#0265DC] border border-[#444444] rounded-sm text-xs font-semibold transition-all shadow-sm"
                id="btn-load-demos"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Load Demo Stock Samples</span>
              </button>
            </div>
          )}

          {/* Queue management list */}
          <div className="flex-1">
            <BatchList
              images={images}
              selectedImageId={selectedImageId}
              onSelectImage={(id) => setSelectedImageId(id)}
              onRemoveImage={handleRemoveImage}
              onAnalyzeImage={handleAnalyzeImage}
            />
          </div>

          {/* Batch operations buttons */}
          {images.length > 0 && (
            <div className="bg-[#252525] border border-[#333333] p-3 rounded-sm space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#999999]">
                <span>Completed: {completedCount}</span>
                <span>Pending: {pendingCount}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleBulkAnalyze}
                  disabled={isBulkAnalyzing || pendingCount === 0}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-sm text-xs font-bold transition-all ${
                    isBulkAnalyzing || pendingCount === 0
                      ? "bg-[#333333] text-[#666666] cursor-not-allowed border border-[#444444]"
                      : "bg-[#0265DC] hover:bg-[#0052b4] text-white shadow-sm"
                  }`}
                  id="btn-bulk-analyze"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isBulkAnalyzing ? "Scanning..." : "Analyze All"}</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  disabled={completedCount === 0}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-sm text-xs font-bold border transition-all ${
                    completedCount === 0
                      ? "border-[#333333] bg-[#1a1a1a] text-[#666666] cursor-not-allowed"
                      : "border-[#333333] bg-[#1a1a1a] text-green-400 hover:bg-green-600 hover:text-white"
                  }`}
                  id="btn-export-csv"
                >
                  <FileSpreadsheet className="w-3 h-3" />
                  <span>Export CSV</span>
                </button>
              </div>

              {generalError && (
                <div className="p-2 rounded-sm bg-[#FA0F00]/5 border border-[#FA0F00]/15 text-[#FA0F00] text-[10px] leading-tight flex items-start gap-1">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{generalError}</span>
                </div>
              )}

              <button
                onClick={handleClearQueue}
                className="w-full py-1 text-center text-[10px] text-[#666666] hover:text-[#FA0F00] hover:bg-[#FA0F00]/5 border border-transparent rounded-sm transition-all"
                id="btn-clear-queue"
              >
                Clear Entire Queue
              </button>
            </div>
          )}
        </section>

        {/* Right Hand / Workspace Pane (Col span 8) */}
        <section className="lg:col-span-8 space-y-5" id="workspace-pane">
          {showHelp ? (
            <GuidelineCard />
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {/* Technical Diagnostics */}
              <DiagnosticPanel
                image={selectedImage}
                onAnalyze={handleAnalyzeImage}
                onUpdateNotes={handleUpdateNotes}
              />

              {/* Guidelines-compliant Metadata and tag cloud */}
              {selectedImage && selectedImage.status === "completed" && (
                <MetadataForm
                  image={selectedImage}
                  onUpdateMetadata={handleUpdateMetadata}
                />
              )}
            </div>
          )}
        </section>
      </main>

      {/* Sleek Adobe active status bar footer */}
      <footer className="h-8 bg-[#0265DC] flex items-center px-4 justify-between text-[10px] font-medium text-white sticky bottom-0 z-20">
        <div className="flex gap-4">
          <span>Session: Active</span>
          <span>Workspace Load: {images.length} Assets</span>
        </div>
        <div className="flex gap-4">
          <span className="animate-pulse">● Quality Check Live</span>
          <span>V 2.1.4 Stable</span>
        </div>
      </footer>
    </div>
  );
}
