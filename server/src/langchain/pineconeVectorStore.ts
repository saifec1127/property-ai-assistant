import { PineconeStore } from "@langchain/pinecone";

import { embeddings } from "./embeddings";
import { pineconeIndex } from "./pinecone";

export async function getPineconeVectorStore() {
  return PineconeStore.fromExistingIndex(
    embeddings,
    {
      pineconeIndex,
      namespace: "hiba",
      textKey: "text",
    }
  );
}