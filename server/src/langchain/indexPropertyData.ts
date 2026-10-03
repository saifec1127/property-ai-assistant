import "dotenv/config";

import { embeddings } from "./embeddings";
import { pineconeIndex } from "./pinecone";

import { splitDomainDocuments } from "../data/domainTextSplitter";

// ========================================
// PINECONE NAMESPACE
// ========================================
const namespace = process.env.PINECONE_NAMESPACE ?? "property";

// ========================================
// INDEX PROPERTY DATA
// ========================================
async function indexPropertyData() {
  console.log("\nLoading property documents...");

  // ------------------------------------
  // Markdown files load + chunks
  // ------------------------------------
  const chunks = await splitDomainDocuments();

  console.log(`Total property chunks: ${chunks.length}`);

  // ------------------------------------
  // Validation
  // ------------------------------------
  if (chunks.length === 0) {
    throw new Error("No property chunks found.");
  }

  // ------------------------------------
  // Extract chunk text
  // ------------------------------------
  const texts = chunks.map((chunk) => chunk.pageContent);

  // ====================================
  // GENERATE EMBEDDINGS
  // ====================================
  console.log("Generating OpenAI embeddings...");

  const vectors = await embeddings.embedDocuments(texts);

  console.log(`Total embeddings generated: ${vectors.length}`);

  // ------------------------------------
  // Validation
  // ------------------------------------
  if (vectors.length !== chunks.length) {
    throw new Error("Chunks and embeddings count do not match.");
  }

  // ====================================
  // PREPARE PINECONE RECORDS
  // ====================================
  const records = chunks.map((chunk, index) => {
    const vector = vectors[index];

    if (!vector) {
      throw new Error(`Missing embedding for chunk ${index}`);
    }

    return {
      id: `property-chunk-${index}`,

      values: vector,

      metadata: {
        text: chunk.pageContent,

        source: String(chunk.metadata.source ?? ""),

        category: String(chunk.metadata.category ?? ""),

        domain: "property",

        city: "Prayagraj",
      },
    };
  });

  console.log(`Prepared ${records.length} Pinecone records.`);

  // ====================================
  // UPLOAD TO PINECONE
  // ====================================
  console.log(`Uploading to namespace: ${namespace}`);

  await pineconeIndex.namespace(namespace).upsert(records);

  console.log("\nProperty data uploaded successfully.");
}

// ========================================
// RUN INDEXING
// ========================================
indexPropertyData().catch((error) => {
  console.error("Property Pinecone indexing failed:", error);

  process.exit(1);
});
