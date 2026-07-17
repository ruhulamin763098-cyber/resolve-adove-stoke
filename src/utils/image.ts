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
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Apply a gentle contrast and saturation optimization
        // This solves "underexposure / dull colors"
        const contrast = 12; // mild boost
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < data.length; i += 4) {
          // Adjust Contrast
          data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));     // Red
          data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128)); // Green
          data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128)); // Blue

          // Boost Saturation slightly (10%)
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
          data[i] = Math.min(255, Math.max(0, gray + (r - gray) * 1.15));
          data[i + 1] = Math.min(255, Math.max(0, gray + (g - gray) * 1.15));
          data[i + 2] = Math.min(255, Math.max(0, gray + (b - gray) * 1.15));
        }

        ctx.putImageData(imageData, 0, 0);

        // Apply a fast client-side 3x3 Sharpening Convolution Filter to eliminate "Soft Focus / Blur"
        // Kernel:
        //  0  -0.3  0
        // -0.3 2.2 -0.3
        //  0  -0.3  0
        const weights = [
           0,   -0.35,  0,
          -0.35, 2.4,  -0.35,
           0,   -0.35,  0
        ];
        const side = Math.round(Math.sqrt(weights.length));
        const halfSide = Math.floor(side / 2);
        const src = ctx.getImageData(0, 0, width, height).data;
        const output = ctx.createImageData(width, height);
        const dst = output.data;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const sy = y;
            const sx = x;
            const dstOff = (y * width + x) * 4;

            // Calculate weight sum
            let rSum = 0;
            let gSum = 0;
            let bSum = 0;

            for (let cy = 0; cy < side; cy++) {
              for (let cx = 0; cx < side; cx++) {
                const scy = Math.min(height - 1, Math.max(0, sy + cy - halfSide));
                const scx = Math.min(width - 1, Math.max(0, sx + cx - halfSide));
                const srcOff = (scy * width + scx) * 4;
                const wt = weights[cy * side + cx];

                rSum += src[srcOff] * wt;
                gSum += src[srcOff + 1] * wt;
                bSum += src[srcOff + 2] * wt;
              }
            }

            dst[dstOff] = Math.min(255, Math.max(0, rSum));
            dst[dstOff + 1] = Math.min(255, Math.max(0, gSum));
            dst[dstOff + 2] = Math.min(255, Math.max(0, bSum));
            dst[dstOff + 3] = src[dstOff + 3]; // Preserve alpha
          }
        }

        ctx.putImageData(output, 0, 0);
      } catch (err) {
        console.warn("Could not apply canvas filters (potentially tainted canvas or resource issue):", err);
      }

      // Export high-quality upscaled JPEG
      const upscaledDataUrl = canvas.toDataURL("image/jpeg", 0.92);
      resolve(upscaledDataUrl);
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}
