import { Annotation } from "@langchain/langgraph";
import type { Document } from "@langchain/core/documents";

// ===================================
// INTENT TYPE
// ===================================
//
// User ka message kis workflow me
// jana chahiye, ye intent batata hai.
//
// greeting
// → Hi, Hello, Hey
//
// property
// → User property search/recommendation
//   chahta hai.
//
// Example:
// "I need a 3BHK flat in Kareli"
//
// property_knowledge
// → User property/location ke bare me
//   information chahta hai.
//
// Example:
// "Kareli area kaisa hai?"
//
// out_of_domain
// → Property domain se unrelated query.
//
// Example:
// "Who is Virat Kohli?"
// ===================================
export type Intent =
  | "greeting"
  | "property"
  | "property_knowledge"
  | "out_of_domain";

// ===================================
// CHAT MESSAGE TYPE
// ===================================
export type GraphMessage = {
  role: "user" | "assistant";
  content: string;
};

// ===================================
// LANGGRAPH SHARED STATE
// ===================================
export const GraphState = Annotation.Root({
  // =================================
  // COMMON STATE
  // =================================

  // ---------------------------------
  // Original user input
  //
  // Example:
  // "I need a 3BHK flat in Prayagraj"
  // ---------------------------------
  input: Annotation<string>,

  // ---------------------------------
  // Unique conversation/session id
  //
  // Same session id is also sent to
  // Python FastAPI service.
  // ---------------------------------
  sessionId: Annotation<string>,

  // ---------------------------------
  // Conversation messages
  //
  // reducer ka matlab:
  //
  // old messages
  // +
  // new messages
  //
  // merge hote rahenge.
  // ---------------------------------
  messages: Annotation<GraphMessage[]>({
    reducer: (current, update) => [...current, ...update],

    default: () => [],
  }),

  // ---------------------------------
  // Previous conversation ko plain
  // text me convert karke rakhta hai.
  //
  // Example:
  //
  // User: I want a flat
  // Assistant: Which area?
  // ---------------------------------
  historyText: Annotation<string>,

  // ---------------------------------
  // Rewritten / processed user query
  //
  // Existing RAG workflow me use hota
  // hai before Pinecone retrieval.
  // ---------------------------------
  processedInput: Annotation<string>,

  // =================================
  // MAIN ROUTING STATE
  // =================================

  // ---------------------------------
  // Router decide karega ki request
  // kis workflow me jani chahiye.
  //
  // Possible values:
  //
  // greeting
  // property
  // property_knowledge
  // out_of_domain
  // ---------------------------------
  intent: Annotation<Intent>,

  // =================================
  // PROPERTY WORKFLOW STATE
  // =================================

  // ---------------------------------
  // Python FastAPI batata hai ki
  // recommendation ke liye required
  // information complete hai ya nahi.
  //
  // false
  // → aur information puchni hai
  //
  // true
  // → recommendations fetch kar sakte hain
  // ---------------------------------
  propertyReady: Annotation<boolean>,

  // ---------------------------------
  // Python FastAPI se returned
  // follow-up question.
  //
  // Example:
  //
  // "Do you prefer furnished,
  // semi-furnished, or unfurnished?"
  // ---------------------------------
  propertyNextQuestion: Annotation<string>,

  // ---------------------------------
  // Python recommendation service se
  // returned ranked properties.
  //
  // Example:
  //
  // [
  //   {
  //     property_id: "FLAT-001",
  //     match_score: 100
  //   }
  // ]
  //
  // Later `any[]` ko proper
  // PropertyRecommendation[] type se
  // replace karenge.
  // ---------------------------------
  propertyRecommendations: Annotation<any[]>(),

  // =================================
  // RAG WORKFLOW STATE
  // =================================

  // ---------------------------------
  // Pinecone / vector database se
  // retrieve hue documents.
  // ---------------------------------
  documents: Annotation<Document[]>,

  // ---------------------------------
  // Retrieved documents ko format
  // karke jo context LLM ko bhejte hain.
  // ---------------------------------
  context: Annotation<string>,

  // ---------------------------------
  // Retrieved RAG context useful hai
  // ya irrelevant.
  //
  // true
  // → response generate karo
  //
  // false
  // → query improve/retry karo
  // ---------------------------------
  isContextRelevant: Annotation<boolean>,

  // ---------------------------------
  // RAG retrieval ke query rewrite
  // attempts count karta hai.
  // ---------------------------------
  retryCount: Annotation<number>,

  // ---------------------------------
  // Batata hai ki rewritten query
  // original/current query se actually
  // different aur improved hui ya nahi.
  // ---------------------------------
  isQueryImproved: Annotation<boolean>,

  // =================================
  // FINAL RESPONSE STATE
  // =================================

  // ---------------------------------
  // Final response jo frontend/UI ko
  // return hoga.
  //
  // Greeting response,
  // property response,
  // RAG response,
  // fallback response
  //
  // sab isi field me aayenge.
  // ---------------------------------
  output: Annotation<string>,

  // ---------------------------------
  // Generated RAG response quality
  // validation pass hui ya nahi.
  // ---------------------------------
  isResponseValid: Annotation<boolean>,

  // ---------------------------------
  // Invalid AI response ko kitni baar
  // regenerate kiya gaya.
  // ---------------------------------
  responseRetryCount: Annotation<number>,
});

// ===================================
// TYPESCRIPT TYPE FOR GRAPH STATE
// ===================================
export type GraphStateType = typeof GraphState.State;
