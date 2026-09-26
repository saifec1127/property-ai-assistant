// import { askHiba } from "../langchain/askHiba";

// export const resolvers = {
//   Query: {
//     askHiba: async (
//       _: unknown,
//       {
//         question,
//         sessionId,
//       }: {
//         question: string;
//         sessionId: string;
//       }
//     ) => {
//       const answer =
//         await askHiba(
//           question,
//           sessionId
//         );

//       return {
//         answer,
//       };
//     },
//   },
// };