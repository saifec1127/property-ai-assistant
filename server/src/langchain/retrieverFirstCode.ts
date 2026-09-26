// import { searchHibaVectorStore } from "./vectorStore";

// export async function retrieveHibaDocuments(
//   question: string,
//   k = 2
// ) {
//   const results = await searchHibaVectorStore(question, k);

//   return results.map((result) => ({
//     pageContent: result.pageContent,
//     metadata: result.metadata,
//   }));
// }

// export function formatDocumentsAsContext(
//   documents: {
//     pageContent: string;
//     metadata: Record<string, unknown>;
//   }[]
// ) {
//   return documents
//     .map((document) => document.pageContent)
//     .join("\n\n");
// }