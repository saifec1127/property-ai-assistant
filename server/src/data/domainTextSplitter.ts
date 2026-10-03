import {
  RecursiveCharacterTextSplitter,
} from "@langchain/textsplitters";

import {
  loadDomainDocuments,
} from "./domainDocumentLoader";


// ========================================
// SPLIT DOMAIN DOCUMENTS
// ========================================
//
// Large markdown documents ko small
// chunks me divide karta hai.
//
// Ye chunks baad me embeddings me
// convert honge.
// ========================================
export async function splitDomainDocuments() {

  // --------------------------------------
  // Step 1:
  // Property documents load karo
  // --------------------------------------
  const documents =
    await loadDomainDocuments();


  // --------------------------------------
  // Step 2:
  // Text splitter configure karo
  // --------------------------------------
  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 80,
    });


  // --------------------------------------
  // Step 3:
  // Documents ko chunks me split karo
  // --------------------------------------
  const chunks =
    await splitter.splitDocuments(
      documents,
    );


  return chunks;
}