/**
 * Helper to resize and compress images on the client side before uploading/processing.
 * This ensures they fit perfectly inside the browser's localStorage quota limits
 * and process faster when sent to the AI analysis API.
 */
export function resizeAndCompressImage(file: File, maxDimension: number = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error("Failed to read file"));
        return;
      }

      // If it is an SVG, we don't need to rasterize/resize it (keep it sharp and lightweight)
      if (file.type === "image/svg+xml") {
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions preserving aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback to original if canvas context is not supported
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Export to JPEG with 0.75 quality for great compression and sharp visual display
        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
        resolve(resizedDataUrl);
      };

      img.onerror = () => {
        // Fallback to original if loading as image fails (e.g. unhandled image codec)
        resolve(dataUrl);
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Upscales an image to 2x (or target high resolution) and applies enhancement filters:
 * 1. Sharpening convolution filter to solve "soft-focus / blur" issues.
 * 2. Subtle contrast & saturation adjustments to solve "exposure & noise" issues.
 * 3. High quality scaling to deliver an ultra-sharp, high-resolution Adobe Stock-ready export.
 */
export function upscaleAndEnhanceImage(dataUrl: string, scaleFactor: number = 2): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const width = Math.round(img.width * scaleFactor);
        const height = Math.round(img.height * scaleFactor);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        // Use superior quality interpolation settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw the scaled up version of the image
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const srcImageData = ctx.getImageData(0, 0, width, height);
          const src = srcImageData.data;
          const output = ctx.createImageData(width, height);
          const dst = output.data;

          const contrast = 12; // mild boost
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
          const w4 = width * 4;

          // Copy top and bottom borders as fallbacks
          for (let x = 0; x < width; x++) {
            const topIdx = x * 4;
            dst[topIdx] = src[topIdx];
            dst[topIdx + 1] = src[topIdx + 1];
            dst[topIdx + 2] = src[topIdx + 2];
            dst[topIdx + 3] = src[topIdx + 3];

            const bottomIdx = ((height - 1) * width + x) * 4;
            dst[bottomIdx] = src[bottomIdx];
            dst[bottomIdx + 1] = src[bottomIdx + 1];
            dst[bottomIdx + 2] = src[bottomIdx + 2];
            dst[bottomIdx + 3] = src[bottomIdx + 3];
          }

          // Copy left and right borders as fallbacks
          for (let y = 1; y < height - 1; y++) {
            const leftIdx = y * w4;
            dst[leftIdx] = src[leftIdx];
            dst[leftIdx + 1] = src[leftIdx + 1];
            dst[leftIdx + 2] = src[leftIdx + 2];
            dst[leftIdx + 3] = src[leftIdx + 3];

            const rightIdx = (y * w4) + (width - 1) * 4;
            dst[rightIdx] = src[rightIdx];
            dst[rightIdx + 1] = src[rightIdx + 1];
            dst[rightIdx + 2] = src[rightIdx + 2];
            dst[rightIdx + 3] = src[rightIdx + 3];
          }

          // Highly optimized single-pass unrolled cross-convolution + contrast + saturation filter
          for (let y = 1; y < height - 1; y++) {
            const rowOffset = y * w4;
            for (let x = 1; x < width - 1; x++) {
              const idx = rowOffset + x * 4;

              // 1. Unrolled cross-convolution sharpening: center 2.4, neighbors -0.35
              const rSum = src[idx] * 2.4 - (src[idx - w4] + src[idx + w4] + src[idx - 4] + src[idx + 4]) * 0.35;
              const gSum = src[idx + 1] * 2.4 - (src[idx + 1 - w4] + src[idx + 1 + w4] + src[idx + 1 - 4] + src[idx + 1 + 4]) * 0.35;
              const bSum = src[idx + 2] * 2.4 - (src[idx + 2 - w4] + src[idx + 2 + w4] + src[idx + 2 - 4] + src[idx + 2 + 4]) * 0.35;

              // 2. Contrast adjustment
              const rC = factor * (rSum - 128) + 128;
              const gC = factor * (gSum - 128) + 128;
              const bC = factor * (bSum - 128) + 128;

              // 3. Saturation boost (15%)
              const gray = 0.2989 * rC + 0.587 * gC + 0.114 * bC;
              const rF = gray + (rC - gray) * 1.15;
              const gF = gray + (gC - gray) * 1.15;
              const bF = gray + (bC - gray) * 1.15;

              // 4. Fast clamp and write directly
              dst[idx] = rF < 0 ? 0 : (rF > 255 ? 255 : rF);
              dst[idx + 1] = gF < 0 ? 0 : (gF > 255 ? 255 : gF);
              dst[idx + 2] = bF < 0 ? 0 : (bF > 255 ? 255 : bF);
              dst[idx + 3] = src[idx + 3]; // Preserve alpha
            }
          }

          ctx.putImageData(output, 0, 0);
        } catch (err) {
          console.warn("Could not apply canvas filters (potentially tainted canvas or resource issue):", err);
        }

        // Export high-quality upscaled JPEG
        const upscaledDataUrl = canvas.toDataURL("image/jpeg", 0.92);
        resolve(upscaledDataUrl);
      } catch (outerErr) {
        console.warn("Error during upscale canvas drawing or export:", outerErr);
        resolve(dataUrl); // fallback to original
      }
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}
