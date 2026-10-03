import type { Document } from "@langchain/core/documents";

import { getPineconeVectorStore } from "./pineconeVectorStore";

// ========================================
// RETRIEVE DOMAIN DOCUMENTS
// ========================================
//
// Pinecone se semantic search karke
// relevant documents/chunks laata hai.
//
// Current domain:
// property
//
// Future:
// health
// finance
// etc.
// ========================================
export async function retrieveDomainDocuments(
  question: string,
  k = 4,
): Promise<Document[]> {
  const vectorStore = await getPineconeVectorStore();

  const documents = await vectorStore.similaritySearch(question, k);

  return documents;
}

// ========================================
// FORMAT DOCUMENTS AS LLM CONTEXT
// ========================================
//
// Retrieved documents ko ek readable
// string me convert karta hai jise LLM
// context ke form me use karega.
// ========================================
export function formatDocumentsAsContext(documents: Document[]): string {
  return documents
    .map(
      (document, index) => `
Document ${index + 1}

Source:
${String(document.metadata.source ?? "unknown")}

Content:
${document.pageContent}
`,
    )
    .join("\n\n");
}
