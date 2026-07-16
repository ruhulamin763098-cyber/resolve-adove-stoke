import { AnalyzedImage } from "../types";

/**
 * Downloads an Adobe Stock compliant CSV file for bulk metadata uploading.
 * CSV Header: Filename,Title,Keywords,Category,Editorial
 */
export function exportToAdobeStockCSV(images: AnalyzedImage[]) {
  // Filter for completed images with generated metadata
  const completedImages = images.filter(
    (img) => img.status === "completed" && img.adobeStockMetadata
  );

  if (completedImages.length === 0) return false;

  const headers = ["Filename", "Title", "Keywords", "Category", "Editorial"];

  const rows = completedImages.map((img) => {
    const meta = img.adobeStockMetadata!;

    // Clean filename (remove special chars or spaces that might break index matches, but preserve extensions)
    const filename = img.filename.replace(/,/g, "");

    // Clean title (remove double quotes to avoid CSV breaking, limit length)
    const title = meta.suggestedTitle.replace(/"/g, '""');

    // Keywords must be comma-separated, wrapped in double quotes for CSV safety
    const keywords = meta.suggestedKeywords.join(", ").replace(/"/g, '""');

    // Category name
    const category = meta.category.replace(/"/g, '""');

    // Editorial flag (default to "no" since Generative AI or commercial stock)
    const editorial = "no";

    return [
      `"${filename}"`,
      `"${title}"`,
      `"${keywords}"`,
      `"${category}"`,
      `"${editorial}"`,
    ];
  });

  // Combine rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");

  // Create a blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  // Format date for filename: YYYY-MM-DD
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `adobe_stock_metadata_${dateStr}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
}
