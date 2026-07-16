import { CommonGuideline } from "../types";

export const ADOBE_STOCK_GUIDELINES: CommonGuideline[] = [
  {
    title: "Technical Quality / Soft Focus & Blur",
    rejectionReason: "One of the most common rejections. Adobe inspects images at 100% zoom. Any camera shake, out-of-focus subjects, or soft pixels can cause a rejection.",
    solution: "Use a dedicated high-quality AI Upscaler (like Magnific, Topaz Gigapixel, or Real-ESRGAN) to regenerate sharp details. If photographing, use a higher shutter speed and stabilize.",
    tips: [
      "View your image at 100% zoom (1:1 pixel level) before uploading.",
      "Apply high-pass filtering or localized sharpening on the main subject.",
      "Avoid upscaling low-resolution web images using simple bilinear resizing."
    ]
  },
  {
    title: "Artifacts, Noise & Banding",
    rejectionReason: "Usually caused by excessive compression (JPEG artifacts), aggressive post-processing, low-light sensors, or bad AI generation in gradient areas (like skies).",
    solution: "Use noise reduction tools. In Photoshop, apply a very subtle blur/noise reduction or camera-raw filter on flat background surfaces (like sky or studio walls).",
    tips: [
      "Save images in high-quality JPEG (Quality 10-12, sRGB color profile).",
      "Check solid color gradients (skies, flat tables) for color 'banding' or blocks.",
      "Use dithering in your editor to smooth out harsh gradients."
    ]
  },
  {
    title: "Intellectual Property & Trademarks",
    rejectionReason: "Adobe Stock strictly forbids visible logos, brand names, registered design elements (like the Nike Swoosh, Apple logo, or recognizable 3-stripe shoes), and protected buildings/landmarks.",
    solution: "Use the clone stamp, spot healing brush, or Photoshop Generative Fill to completely remove any visible brand tags, text, or trademarked shapes.",
    tips: [
      "Scan the image for accidental text, street signs, license plates, or logo shapes.",
      "Remove recognizable clothing brand logos, computer logos, or car badges.",
      "Even generic-looking phone shapes must not have signature brand buttons."
    ]
  },
  {
    title: "Generative AI Distortion & Hallucinations",
    rejectionReason: "Adobe accepts Generative AI images, but rejects those with obvious distortion: extra fingers, overlapping eyes, floating elements, text gibberish, or impossible physics.",
    solution: "Use Inpainting (Generative Fill) to fix anatomical errors. Use Photoshop, Krea, or Magnific to redraw hands, faces, and text artifacts.",
    tips: [
      "Carefully count fingers and toes. Ensure eyes are pointing in the same direction.",
      "Avoid submitting images with melted background details or weird organic fusions.",
      "Make sure generated text is fully legible or entirely erased/inpainted out."
    ]
  },
  {
    title: "Metadata / Forbidden Titles & Keywords",
    rejectionReason: "Adobe rejects submissions that use spammy keywords, keyword stuffing, or titles with buzzwords like 'hyperdetailed', 'masterpiece', 'trending on ArtStation', or '4K'. Mentioning 'AI' in the Title is also rejected.",
    solution: "Write simple, factual, and objective titles (e.g., 'Golden retriever dog sitting on grass'). List keywords in order of strict relevance. Don't spam unrelated tags.",
    tips: [
      "Select 'Created using generative AI tools' checkbox when submitting.",
      "Never write 'AI generated', 'Midjourney', or 'Stable Diffusion' in titles.",
      "Keep keywords under 50. Adobe permits 5-50 keywords; 15-35 is the sweet spot."
    ]
  },
  {
    title: "Similar Content / Spam",
    rejectionReason: "Uploading 20 nearly identical variations of the same prompt (e.g. slightly different poses of the same character) is flagged as spam and can get your account suspended.",
    solution: "Only submit your 1-2 best variations of a concept. Ensure they are visually distinct, with different compositions, lighting, or primary elements.",
    tips: [
      "Do not do bulk batch submissions of the same generative run.",
      "Make sure each submitted file offers distinct value to a buyer."
    ]
  }
];

export const ADOBE_STOCK_CATEGORIES = [
  "Animals",
  "Buildings and Architecture",
  "Business",
  "Drinks",
  "Environment",
  "States of Mind",
  "Food",
  "Graphic Resources",
  "Hobbies and Leisure",
  "Industry",
  "Landscapes",
  "Lifestyle",
  "People",
  "Plants and Flowers",
  "Culture and Religion",
  "Science",
  "Social Issues",
  "Sports",
  "Technology",
  "Transport",
  "Travel",
  "Other"
];
