
export const splitTextIntoChunks = (
  text,
  chunkSize = 1000,
  overlap = 150
) => {
  if (!text || !text.trim()) {
    return [];
  }

  if (overlap >= chunkSize || overlap < 0) {
    throw new Error("Overlap must be smaller than chunk size");
  }

  const chunks = [];
  let start = 0;
  let chunkIndex = 0;

  while (start < text.length) {
    const end = start + chunkSize;

    const content = text.slice(start, end).trim();

    if (content) {
      chunks.push({
        chunk_index: chunkIndex,
        content
      });

      chunkIndex++;
    }

    start += chunkSize - overlap;
  }

  return chunks;
};