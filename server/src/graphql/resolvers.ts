import { runApplicationGraph } from "../langgraph/runGraph";

type AskInput = {
  question: string;
  sessionId: string;
};

export const resolvers = {
  Query: {
    askHiba: async (_: unknown, { question, sessionId }: AskInput) => {
      const answer = await runApplicationGraph(question, sessionId);

      return {
        answer,
      };
    },
  },
};
