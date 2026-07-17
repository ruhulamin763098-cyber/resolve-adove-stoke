export interface RejectionRisk {
  category: string;
  riskLevel: "Low" | "Medium" | "High";
  description: string;
  remedy: string;
}

export interface AdobeStockMetadata {
  suggestedTitle: string;
  suggestedKeywords: string[];
  category: string;
  isGenerativeAI: boolean;
}

export interface ChecklistItem {
  item: string;
  status: "Pass" | "Warn" | "Fail";
  comment: string;
}

export interface AnalyzedImage {
  id: string;
  filename: string;
  dataUrl: string;
  fileSize: number;
  mimeType: string;
  status: "idle" | "analyzing" | "completed" | "error";
  error?: string;
  acceptanceRate?: number;
  overallQualityScore?: number;
  rejectionRisks?: RejectionRisk[];
  adobeStockMetadata?: AdobeStockMetadata;
  rejectionChecklist?: ChecklistItem[];
  customNotes?: string;
  usedFallback?: boolean;
}

export interface CommonGuideline {
  title: string;
  rejectionReason: string;
  solution: string;
  tips: string[];
}
