import { Annotation } from "@langchain/langgraph";
import type { Document } from "@langchain/core/documents";

export type GraphMessage = {
  role: "user" | "assistant";
  content: string;
};

export const GraphState = Annotation.Root({
  input: Annotation<string>,

  sessionId: Annotation<string>,

  messages: Annotation<GraphMessage[]>({
    reducer: (current, update) => [...current, ...update],
    default: () => [],
  }),

  historyText: Annotation<string>,

  processedInput: Annotation<string>,

  documents: Annotation<Document[]>,

  context: Annotation<string>,

  isContextRelevant: Annotation<boolean>,

  retryCount: Annotation<number>,

  isQueryImproved: Annotation<boolean>,

  output: Annotation<string>,

  isResponseValid: Annotation<boolean>,

  responseRetryCount: Annotation<number>,
});

export type GraphStateType = typeof GraphState.State;
