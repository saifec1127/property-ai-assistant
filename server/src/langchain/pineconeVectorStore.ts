import "dotenv/config";

import { PineconeStore } from "@langchain/pinecone";

import { embeddings } from "./embeddings";
import { pineconeIndex } from "./pinecone";

// ========================================
// PINECONE NAMESPACE
// ========================================
//
// Property project ke liye:
//
// PINECONE_NAMESPACE=property
//
// Future:
// health
// finance
// etc.
// ========================================
const namespace = process.env.PINECONE_NAMESPACE ?? "property";

// ========================================
// GET PINECONE VECTOR STORE
// ========================================
export async function getPineconeVectorStore() {
  return PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,

    namespace,

    textKey: "text",
  });
}
