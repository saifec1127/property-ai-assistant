import type { Document } from "@langchain/core/documents";

import { getPineconeVectorStore } from "./pineconeVectorStore";

export async function retrieveHibaDocuments(
  question: string,
  k = 4,
): Promise<Document[]> {
  const vectorStore = await getPineconeVectorStore();

  const documents = await vectorStore.similaritySearch(question, k);

  return documents;
}

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
