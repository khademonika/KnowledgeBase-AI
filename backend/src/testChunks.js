
import { splitTextIntoChunks } from "./rag/chunkService.js";

const sampleText = "React is a JavaScript library. ".repeat(100);

const chunks = splitTextIntoChunks(sampleText);

console.log("Total chunks:", chunks.length);
console.log("First chunk:", chunks[0]);
console.log("Second chunk:", chunks[1]);