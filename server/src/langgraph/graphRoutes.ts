import type { GraphStateType } from "./state";


// ========================================
// MAIN INTENT ROUTING
// ========================================
//
// detectIntentNode ne jo intent identify
// kiya hai, uske basis par decide karta
// hai ki next node kaunsa chalega.
// ========================================
export function routeByIntent(
  state: GraphStateType,
) {
  // ------------------------------------
  // Greeting
  // ------------------------------------
  if (state.intent === "greeting") {
    return "greetingResponse";
  }


  // ------------------------------------
  // Actual property search
  // ------------------------------------
  if (state.intent === "property") {
    return "propertyIntake";
  }


  // ------------------------------------
  // Property knowledge / RAG
  // ------------------------------------
  if (
    state.intent ===
    "property_knowledge"
  ) {
    return "processInput";
  }


  // ------------------------------------
  // Anything outside property domain
  // ------------------------------------
  return "outOfDomainResponse";
}


// ========================================
// PROPERTY INTAKE ROUTING
// ========================================
//
// FastAPI ne enough information collect
// kar li hai ya nahi.
// ========================================
export function routeAfterPropertyIntake(
  state: GraphStateType,
) {
  if (state.propertyReady) {
    return "fetchPropertyRecommendations";
  }

  return "propertyFollowUp";
}


// ========================================
// RAG CONTEXT VALIDATION ROUTING
// ========================================
//
// Pinecone se useful context mila?
// ========================================
export function routeAfterValidation(
  state: GraphStateType,
) {
  if (state.isContextRelevant) {
    return "generateResponse";
  }

  if (state.retryCount >= 2) {
    return "fallbackResponse";
  }

  return "improveInput";
}


// ========================================
// RAG RESPONSE VALIDATION ROUTING
// ========================================
//
// LLM ka generated answer valid hai?
// ========================================
export function routeAfterResponseValidation(
  state: GraphStateType,
) {
  if (state.isResponseValid) {
    return "saveHistory";
  }

  if (
    state.responseRetryCount >= 2
  ) {
    return "saveHistory";
  }

  return "regenerateResponse";
}


// ========================================
// QUERY IMPROVEMENT ROUTING
// ========================================
//
// Improved search query actually changed
// hui hai to Pinecone dubara search karega.
// ========================================
export function routeAfterInputImprovement(
  state: GraphStateType,
) {
  if (state.isQueryImproved) {
    return "retrieveContext";
  }

  return "fallbackResponse";
}