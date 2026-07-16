import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set body parser limits for base64 image uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY environment variable is required. Please configure it in Settings > Secrets."
      );
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to analyze Adobe Stock upload images
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { imageBase64, mimeType, filename, customNotes } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: "Missing imageBase64 data." });
      return;
    }

    const ai = getGeminiClient();

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64,
      },
    };

    const textPart = {
      text: `You are an expert Adobe Stock Quality Assurance and Submission Specialist.
Analyze the uploaded image for potential technical, intellectual property, and guidelines violations based on Adobe Stock acceptance rules.

Adobe Stock guidelines state that:
1. Technical quality must be pristine (no soft focus/blur, no sensor dust, no compression artifacts/noise, no over/underexposure).
2. For Generative AI: Titles must NOT use buzzwords ("hyperdetailed", "photorealistic", "ultra", "4k"). Titles must be clean, descriptive, simple, and list facts. There must be no editorializing or claims of "real newsworthy events". Keywords must be ordered by relevance (first keyword is the most important).
3. No intellectual property issues (no brand names, logos, registered designs, recognizable people without release, or protected architecture/landmarks).

Please evaluate this image and generate:
- An overall estimated acceptance rate (0 to 100).
- An overall quality score (1 to 10).
- Rejection risks categorized by "Focus & Sharpness", "Exposure & Highlights", "Artifacts & Noise", "AI Distortion & Hallucinations", "IP & Trademark Concerns", or "Composition".
- Detailed actionable remedies for any medium or high risk issues.
- Optimized and fully guidelines-compliant Adobe Stock Title (7-10 words, simple, descriptive) and 35-45 search Keywords ordered by relevance (comma-separated tags, strictly relevant, no spam tags).
- A checklist of elements (accidental logos, clean edges, proper upscaling) with status (Pass/Warn/Fail) and comments.

${customNotes ? `User notes / context: ${customNotes}` : ""}
Filename provided: ${filename || "unnamed_image.jpg"}`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, textPart],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            acceptanceRate: {
              type: Type.INTEGER,
              description: "Estimated percentage chance (0-100) of acceptance on Adobe Stock.",
            },
            overallQualityScore: {
              type: Type.INTEGER,
              description: "Overall technical score of the image from 1 to 10.",
            },
            rejectionRisks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "Category of risk, e.g., 'Focus & Sharpness', 'Artifacts & Noise', 'AI Distortion', 'IP & Trademarks', 'Exposure'." },
                  riskLevel: { type: Type.STRING, description: "Risk level: 'Low', 'Medium', 'High'." },
                  description: { type: Type.STRING, description: "Brief details of what issues are present." },
                  remedy: { type: Type.STRING, description: "Actionable solution or steps to fix this problem using editing tools like Photoshop, upscalers, etc." },
                },
                required: ["category", "riskLevel", "description", "remedy"],
              },
            },
            adobeStockMetadata: {
              type: Type.OBJECT,
              properties: {
                suggestedTitle: { type: Type.STRING, description: "A guidelines-compliant title. Simple, descriptive, factual. No spam terms like 'photorealistic' or 'masterpiece'." },
                suggestedKeywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of 35-45 highly relevant, non-spam tags/keywords, ordered by relevance (most important first).",
                },
                category: { type: Type.STRING, description: "Recommended category (e.g. Graphic Resources, Photos, Illustrations, Landscapes)." },
                isGenerativeAI: { type: Type.BOOLEAN, description: "Whether this looks like Generative AI content." },
              },
              required: ["suggestedTitle", "suggestedKeywords", "category", "isGenerativeAI"],
            },
            rejectionChecklist: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING, description: "Checklist item (e.g., 'IP and Brand Logos Check', 'Face and Anatomy Distortion', 'Artifacts/Upscaling Noise')." },
                  status: { type: Type.STRING, description: "'Pass', 'Warn', or 'Fail'." },
                  comment: { type: Type.STRING, description: "Diagnostic explanation of the status." },
                },
                required: ["item", "status", "comment"],
              },
            },
          },
          required: ["acceptanceRate", "overallQualityScore", "rejectionRisks", "adobeStockMetadata", "rejectionChecklist"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini API.");
    }

    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Image analysis error:", error);
    res.status(500).json({
      error: error.message || "Failed to analyze the image.",
    });
  }
});

// Setup Vite or static serving
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to start server:", err);
});
