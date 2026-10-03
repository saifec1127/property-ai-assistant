import "dotenv/config";

import { embeddings } from "../langchain/embeddings";

import { splitDomainDocuments } from "./domainTextSplitter";

async function run() {
  // ======================================
  // CREATE CHUNKS
  // ======================================
  const chunks = await splitDomainDocuments();

  console.log("Total chunks:", chunks.length);

  // ======================================
  // GET TEXT FROM CHUNKS
  // ======================================
  const chunkTexts = chunks.map((chunk) => chunk.pageContent);

  // ======================================
  // CREATE EMBEDDINGS
  // ======================================
  const vectors = await embeddings.embedDocuments(chunkTexts);

  console.log("Total vectors:", vectors.length);

  // ======================================
  // CHECK FIRST VECTOR
  // ======================================
  const firstVector = vectors[0];

  if (!firstVector) {
    throw new Error("No embedding vector was generated.");
  }

  console.log("First vector length:");

  console.log(firstVector.length);

  console.log("First few vector values:");

  console.log(firstVector.slice(0, 10));
}

run().catch((error) => {
  console.error("Embedding test failed:", error);

  process.exit(1);
});
