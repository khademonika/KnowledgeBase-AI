
import { PDFParse } from "pdf-parse";

export const extractPdfText = async (pdfBuffer) => {
  const parser = new PDFParse({
    data: pdfBuffer
  });

  try {
    const result = await parser.getText();

    const extractedText = result.text.trim();

    if (!extractedText) {
      throw new Error(
        "No readable text found in this PDF. It may be scanned."
      );
    }

    return extractedText;

  } finally {
    await parser.destroy();
  }
};
