import "dotenv/config";

import { embeddings } from "../langchain/embeddings";
import { splitHibaDocuments } from "./hibaTextSplitter";

async function run() {
  const chunks = await splitHibaDocuments();

  console.log("Total chunks:", chunks.length);

  const chunkTexts = chunks.map((chunk) => {
    return chunk.pageContent;
  });

const vectors = await embeddings.embedDocuments(chunkTexts);

console.log("Total vectors:", vectors.length);

const firstVector = vectors[0];

if (!firstVector) {
  throw new Error("No embedding vector was generated.");
}

console.log("First vector length:");
console.log(firstVector.length);

console.log("First few vector values:");
console.log(firstVector.slice(0, 10));
}

run();