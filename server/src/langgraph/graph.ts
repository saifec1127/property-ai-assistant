import { END, START, StateGraph } from "@langchain/langgraph";

import { checkpointer } from "./checkpointer";

import { GraphState } from "./state";


// ===================================
// EXISTING GENERAL RAG NODES
// ===================================
import {
  fallbackResponseNode,
  generateResponseNode,
  improveInputNode,
  loadHistoryNode,
  processInputNode,
  regenerateResponseNode,
  retrieveContextNode,
  saveHistoryNode,
  validateContextNode,
  validateResponseNode,
} from "./nodes";

// ===================================
// INTENT ROUTING NODES
// ===================================
//
// detectIntentNode
// → user ka intent decide karega
//
// greetingNode
// → Hi/Hello ka direct response
//
// outOfDomainNode
// → property domain ke bahar query ko
//   politely redirect karega
// ===================================
import {
  detectIntentNode,
  greetingNode,
  outOfDomainNode,
} from "./routingNodes";

// ===================================
// PROPERTY WORKFLOW NODES
// ===================================
import {
  propertyIntakeNode,
  propertyFollowUpNode,
  propertyRecommendationsNode,
  generatePropertyResponseNode,
} from "../property/langgraph/propertyNodes";

// ===================================
// GRAPH ROUTING FUNCTIONS
// ===================================
import {
  routeByIntent,
  routeAfterPropertyIntake,
  routeAfterValidation,
  routeAfterResponseValidation,
  routeAfterInputImprovement,
} from "./graphRoutes";

// ===================================
// CREATE GRAPH
// ===================================
//
// Yahan hum saare nodes register
// aur connect karte hain.
// ===================================
const workflow = new StateGraph(GraphState)

  // =================================
  // COMMON NODES
  // =================================

  // Previous chat history load karta hai
  .addNode("loadHistory", loadHistoryNode)

  // User intent identify karta hai
  .addNode("detectIntent", detectIntentNode)

  // =================================
  // SIMPLE RESPONSE NODES
  // =================================

  // Hi / Hello ke liye
  .addNode("greetingResponse", greetingNode)

  // Property domain se bahar query
  .addNode("outOfDomainResponse", outOfDomainNode)

  // =================================
  // PROPERTY NODES
  // =================================

  // User property preferences
  // FastAPI ko bhejta hai
  .addNode("propertyIntake", propertyIntakeNode)

  // Missing property information ka
  // follow-up question
  .addNode("propertyFollowUp", propertyFollowUpNode)

  // Python FastAPI se ranked
  // recommendations fetch karta hai
  .addNode("fetchPropertyRecommendations", propertyRecommendationsNode)

  // Ranked recommendations ko
  // natural language me convert karta hai
  .addNode("generatePropertyResponse", generatePropertyResponseNode)

  // =================================
  // EXISTING RAG NODES
  // =================================

  // Query rewrite / processing
  .addNode("processInput", processInputNode)

  // Pinecone retrieval
  .addNode("retrieveContext", retrieveContextNode)

  // Retrieved context validation
  .addNode("validateContext", validateContextNode)

  // Poor query ko improve karta hai
  .addNode("improveInput", improveInputNode)

  // RAG response generate karta hai
  .addNode("generateResponse", generateResponseNode)

  // AI response validate karta hai
  .addNode("validateResponse", validateResponseNode)

  // Invalid response regenerate
  .addNode("regenerateResponse", regenerateResponseNode)

  // Property information na mile
  // to fallback response
  .addNode("fallbackResponse", fallbackResponseNode)

  // Conversation save karta hai
  .addNode("saveHistory", saveHistoryNode)

  // =================================
  // APPLICATION START
  // =================================
  //
  // Har request yahan se start hoti hai:
  //
  // START
  // ↓
  // loadHistory
  // ↓
  // detectIntent
  // =================================

  .addEdge(START, "loadHistory")

  .addEdge("loadHistory", "detectIntent")

  // =================================
  // MAIN INTENT ROUTING
  // =================================
  //
  // detectIntent ke baad:
  //
  // greeting
  // → greetingResponse
  //
  // property
  // → propertyIntake
  //
  // property_knowledge
  // → processInput
  //
  // out_of_domain
  // → outOfDomainResponse
  // =================================

  .addConditionalEdges("detectIntent", routeByIntent, [
    "greetingResponse",
    "propertyIntake",
    "processInput",
    "outOfDomainResponse",
  ])

  // =================================
  // GREETING FLOW
  // =================================
  //
  // Hi
  // ↓
  // greetingResponse
  // ↓
  // saveHistory
  // =================================

  .addEdge("greetingResponse", "saveHistory")

  // =================================
  // OUT OF DOMAIN FLOW
  // =================================
  //
  // Who is Virat Kohli?
  // ↓
  // outOfDomainResponse
  // ↓
  // helpful property suggestions
  // ↓
  // saveHistory
  // =================================

  .addEdge("outOfDomainResponse", "saveHistory")

  // =================================
  // PROPERTY WORKFLOW
  // =================================

  // Property intake ke baad:
  //
  // propertyReady = false
  // → propertyFollowUp
  //
  // propertyReady = true
  // → recommendations
  .addConditionalEdges("propertyIntake", routeAfterPropertyIntake, [
    "propertyFollowUp",
    "fetchPropertyRecommendations",
  ])

  // ---------------------------------
  // Missing information
  // ---------------------------------
  .addEdge("propertyFollowUp", "saveHistory")

  // ---------------------------------
  // Information complete
  // ---------------------------------
  //
  // FastAPI recommendations
  // ↓
  // natural AI response
  // ---------------------------------

  .addEdge("fetchPropertyRecommendations", "generatePropertyResponse")

  .addEdge("generatePropertyResponse", "saveHistory")

  // =================================
  // PROPERTY KNOWLEDGE / RAG FLOW
  // =================================
  //
  // Kareli area kaisa hai?
  // ↓
  // processInput
  // ↓
  // retrieveContext
  // ↓
  // Pinecone
  // =================================

  .addEdge("processInput", "retrieveContext")

  .addEdge("retrieveContext", "validateContext")

  // ---------------------------------
  // Validate retrieved context
  // ---------------------------------
  .addConditionalEdges("validateContext", routeAfterValidation, [
    "generateResponse",
    "improveInput",
    "fallbackResponse",
  ])

  // ---------------------------------
  // Improved query retry
  // ---------------------------------
  .addConditionalEdges("improveInput", routeAfterInputImprovement, [
    "retrieveContext",
    "fallbackResponse",
  ])

  // ---------------------------------
  // Generate RAG answer
  // ---------------------------------
  .addEdge("generateResponse", "validateResponse")

  // ---------------------------------
  // Validate generated answer
  // ---------------------------------
  .addConditionalEdges("validateResponse", routeAfterResponseValidation, [
    "saveHistory",
    "regenerateResponse",
  ])

  // ---------------------------------
  // Retry bad answer
  // ---------------------------------
  .addEdge("regenerateResponse", "validateResponse")

  // =================================
  // FALLBACK
  // =================================
  //
  // Question property-related hai,
  // but database/RAG me information
  // nahi mili.
  // =================================

  .addEdge("fallbackResponse", "saveHistory")

  // =================================
  // COMMON END
  // =================================
  //
  // Har successful conversation turn
  // history save karke END hota hai.
  // =================================

  .addEdge("saveHistory", END);

// ===================================
// COMPILE LANGGRAPH
// ===================================
//
// Definition ko executable graph me
// convert karta hai.
//
// checkpointer conversation state ko
// MongoDB me persist karta hai.
// ===================================
export const applicationGraph = workflow.compile({
  checkpointer,
});
