import "dotenv/config";

import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;
const indexName = process.env.PINECONE_INDEX_NAME;

if (!apiKey) {
  throw new Error(
    "PINECONE_API_KEY is missing."
  );
}

if (!indexName) {
  throw new Error(
    "PINECONE_INDEX_NAME is missing."
  );
}

export const pineconeClient =
  new Pinecone({
    apiKey,
  });

export const pineconeIndex =
  pineconeClient.index(indexName);