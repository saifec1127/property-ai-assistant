import { Annotation } from "@langchain/langgraph";
import type { Document } from "@langchain/core/documents";

// -----------------------------------
// Chat Message Type
// -----------------------------------
export type GraphMessage = {
  role: "user" | "assistant";
  content: string;
};

// -----------------------------------
// LangGraph Shared State
// -----------------------------------
export const GraphState = Annotation.Root({
  // -----------------------------------
  // Original user input
  // Example:
  // "I need a 3BHK flat in Noida"
  // -----------------------------------
  input: Annotation<string>,

  // -----------------------------------
  // Unique conversation/session id
  // Same session id is also sent to
  // Python FastAPI service
  // -----------------------------------
  sessionId: Annotation<string>,

  // -----------------------------------
  // Conversation messages
  // LangGraph merges old + new messages
  // because of this reducer
  // -----------------------------------
  messages: Annotation<GraphMessage[]>({
    reducer: (current, update) => [...current, ...update],
    default: () => [],
  }),

  // -----------------------------------
  // Previous conversation converted
  // into plain text
  // -----------------------------------
  historyText: Annotation<string>,

  // -----------------------------------
  // Rewritten / processed user query
  // Used by existing RAG workflow
  // -----------------------------------
  processedInput: Annotation<string>,

  // ===================================
  // PROPERTY WORKFLOW STATE
  // ===================================

  // -----------------------------------
  // Tells LangGraph which flow to use
  //
  // "property"
  //    → FastAPI property microservice
  //
  // "general"
  //    → existing RAG flow
  // -----------------------------------
  intent: Annotation<"property" | "general">,

  // -----------------------------------
  // Tells whether enough property
  // information is available to start
  // recommendations
  //
  // false:
  // more information is required
  //
  // true:
  // recommendation can be generated
  // -----------------------------------
  propertyReady: Annotation<boolean>,

  // -----------------------------------
  // Follow-up question returned by
  // Python FastAPI service
  //
  // Example:
  // "Do you prefer furnished,
  // semi-furnished or unfurnished?"
  // -----------------------------------
  propertyNextQuestion: Annotation<string>,

  // -----------------------------------
  // Ranked properties returned by
  // Python recommendation service
  //
  // Example:
  // [
  //   {
  //     property_id: "FLAT-001",
  //     match_score: 100
  //   }
  // ]
  // -----------------------------------
  propertyRecommendations: Annotation<any[]>,

  // ===================================
  // EXISTING RAG WORKFLOW STATE
  // ===================================

  // -----------------------------------
  // Documents retrieved from
  // vector database / Pinecone
  // -----------------------------------
  documents: Annotation<Document[]>,

  // -----------------------------------
  // Formatted retrieved context
  // sent to LLM
  // -----------------------------------
  context: Annotation<string>,

  // -----------------------------------
  // Whether retrieved RAG context
  // is useful/relevant
  // -----------------------------------
  isContextRelevant: Annotation<boolean>,

  // -----------------------------------
  // Number of query rewrite retries
  // -----------------------------------
  retryCount: Annotation<number>,

  // -----------------------------------
  // Whether rewritten query was
  // actually improved
  // -----------------------------------
  isQueryImproved: Annotation<boolean>,

  // -----------------------------------
  // Final response shown to user
  // -----------------------------------
  output: Annotation<string>,

  // -----------------------------------
  // Whether generated AI response
  // passed validation
  // -----------------------------------
  isResponseValid: Annotation<boolean>,

  // -----------------------------------
  // Number of response regeneration
  // attempts
  // -----------------------------------
  responseRetryCount: Annotation<number>,
});

export type GraphStateType = typeof GraphState.State;
