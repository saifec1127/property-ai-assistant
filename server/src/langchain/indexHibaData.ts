import "dotenv/config";

import { embeddings } from "./embeddings";
import { pineconeIndex } from "./pinecone";
import { splitHibaDocuments } from "../data/hibaTextSplitter";

async function indexHibaData() {
  console.log("Loading Hiba documents...");

  const chunks = await splitHibaDocuments();

  console.log(`Total chunks: ${chunks.length}`);

  if (chunks.length === 0) {
    throw new Error("No Hiba chunks found.");
  }

  const texts = chunks.map((chunk) => chunk.pageContent);

  console.log("Generating OpenAI embeddings...");

  const vectors = await embeddings.embedDocuments(texts);

  console.log(`Total embeddings generated: ${vectors.length}`);

  if (vectors.length !== chunks.length) {
    throw new Error("Chunks and embeddings count do not match.");
  }

  const records = chunks.map((chunk, index) => {
    const vector = vectors[index];

    if (!vector) {
      throw new Error(`Missing embedding for chunk ${index}`);
    }

    return {
      id: `hiba-chunk-${index}`,
      values: vector,
      metadata: {
        text: chunk.pageContent,

        source: String(chunk.metadata.source ?? ""),

        category: String(chunk.metadata.category ?? ""),
      },
    };
  });

  console.log(`Prepared ${records.length} Pinecone records.`);

  console.log("Uploading records to Pinecone...");

  await pineconeIndex.namespace("hiba").upsert(records);

  console.log("Hiba data uploaded successfully.");
}

indexHibaData().catch((error) => {
  console.error("Pinecone indexing failed:", error);

  process.exit(1);
});
