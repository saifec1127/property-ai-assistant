import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { loadHibaDocuments } from "./hibaDocumentLoader";

export async function splitHibaDocuments() {
  const documents = await loadHibaDocuments();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitDocuments(documents);

  return chunks;
}