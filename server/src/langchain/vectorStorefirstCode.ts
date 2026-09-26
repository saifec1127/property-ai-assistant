// import { embeddings } from "./embeddings";
// import { splitHibaDocuments } from "../data/hibaTextSplitter";

// type VectorRecord = {
//   pageContent: string;
//   metadata: Record<string, unknown>;
//   vector: number[];
// };

// function cosineSimilarity(
//   vectorA: number[],
//   vectorB: number[]
// ): number {
//   if (vectorA.length !== vectorB.length) {
//     throw new Error("Vectors must have the same length.");
//   }

//   let dotProduct = 0;
//   let magnitudeA = 0;
//   let magnitudeB = 0;

//   for (let i = 0; i < vectorA.length; i++) {
//     const valueA = vectorA[i];
//     const valueB = vectorB[i];

//     if (valueA === undefined || valueB === undefined) {
//       continue;
//     }

//     dotProduct += valueA * valueB;
//     magnitudeA += valueA * valueA;
//     magnitudeB += valueB * valueB;
//   }

//   const denominator =
//     Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);

//   if (denominator === 0) {
//     return 0;
//   }

//   return dotProduct / denominator;
// }

// export async function createHibaVectorStore() {
//   const chunks = await splitHibaDocuments();

//   const texts = chunks.map(
//     (chunk) => chunk.pageContent
//   );

//   const vectors =
//     await embeddings.embedDocuments(texts);

//   const vectorStore: VectorRecord[] = chunks.map(
//     (chunk, index) => {
//       const vector = vectors[index];

//       if (!vector) {
//         throw new Error(
//           `Missing embedding vector for chunk ${index}`
//         );
//       }

//       return {
//         pageContent: chunk.pageContent,
//         metadata: chunk.metadata,
//         vector,
//       };
//     }
//   );

//   return vectorStore;
// }

// export async function searchHibaVectorStore(
//   question: string,
//   k = 2
// ) {
//   const vectorStore =
//     await createHibaVectorStore();

//   const questionVector =
//     await embeddings.embedQuery(question);

//   const scoredResults = vectorStore.map(
//     (record) => ({
//       ...record,
//       score: cosineSimilarity(
//         questionVector,
//         record.vector
//       ),
//     })
//   );

//   scoredResults.sort(
//     (a, b) => b.score - a.score
//   );

//   return scoredResults.slice(0, k);
// }