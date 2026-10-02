import { END, START, StateGraph } from "@langchain/langgraph";

import { checkpointer } from "./checkpointer";

import { GraphState } from "./state";

import type { GraphStateType } from "./state";

// -----------------------------------
// Existing General RAG Nodes
// -----------------------------------
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

// -----------------------------------
// Main Intent Routing Node
// -----------------------------------
import { detectIntentNode } from "./routingNodes";

// -----------------------------------
// Property Workflow Nodes
// -----------------------------------
import {
  propertyIntakeNode,
  propertyFollowUpNode,
  propertyRecommendationsNode,
} from "../property/langgraph/propertyNodes";

// ===================================
// MAIN ROUTING
// ===================================

// -----------------------------------
// Decide:
// Property workflow OR General RAG
// -----------------------------------
function routeByIntent(state: GraphStateType) {
  if (state.intent === "property") {
    return "propertyIntake";
  }

  return "processInput";
}

// -----------------------------------
// Decide what happens after
// Python property intake
// -----------------------------------
function routeAfterPropertyIntake(state: GraphStateType) {
  if (state.propertyReady) {
    return "fetchPropertyRecommendations";
  }

  return "propertyFollowUp";
}

// ===================================
// EXISTING RAG ROUTING
// ===================================

function routeAfterValidation(state: GraphStateType) {
  if (state.isContextRelevant) {
    return "generateResponse";
  }

  if (state.retryCount >= 2) {
    return "fallbackResponse";
  }

  return "improveInput";
}

function routeAfterResponseValidation(state: GraphStateType) {
  if (state.isResponseValid) {
    return "saveHistory";
  }

  if (state.responseRetryCount >= 2) {
    return "saveHistory";
  }

  return "regenerateResponse";
}

function routeAfterInputImprovement(state: GraphStateType) {
  if (state.isQueryImproved) {
    return "retrieveContext";
  }

  return "fallbackResponse";
}

// ===================================
// CREATE GRAPH
// ===================================

const workflow = new StateGraph(GraphState)

  // =================================
  // COMMON NODES
  // =================================

  .addNode("loadHistory", loadHistoryNode)

  .addNode("detectIntent", detectIntentNode)

  // =================================
  // PROPERTY NODES
  // =================================

  .addNode("propertyIntake", propertyIntakeNode)

  .addNode("propertyFollowUp", propertyFollowUpNode)

  .addNode("fetchPropertyRecommendations", propertyRecommendationsNode)

  // =================================
  // EXISTING GENERAL RAG NODES
  // =================================

  .addNode("processInput", processInputNode)

  .addNode("retrieveContext", retrieveContextNode)

  .addNode("validateContext", validateContextNode)

  .addNode("improveInput", improveInputNode)

  .addNode("generateResponse", generateResponseNode)

  .addNode("validateResponse", validateResponseNode)

  .addNode("regenerateResponse", regenerateResponseNode)

  .addNode("fallbackResponse", fallbackResponseNode)

  .addNode("saveHistory", saveHistoryNode)

  // =================================
  // APPLICATION START
  // =================================

  .addEdge(START, "loadHistory")

  .addEdge("loadHistory", "detectIntent")

  // =================================
  // MAIN INTENT ROUTING
  // =================================

  .addConditionalEdges("detectIntent", routeByIntent, [
    "propertyIntake",
    "processInput",
  ])

  // =================================
  // PROPERTY WORKFLOW
  // =================================

  .addConditionalEdges("propertyIntake", routeAfterPropertyIntake, [
    "propertyFollowUp",
    "fetchPropertyRecommendations",
  ])

  // Missing information
  .addEdge("propertyFollowUp", "saveHistory")

  // Information complete
  .addEdge("fetchPropertyRecommendations", "saveHistory")

  // =================================
  // EXISTING GENERAL RAG WORKFLOW
  // =================================

  .addEdge("processInput", "retrieveContext")

  .addEdge("retrieveContext", "validateContext")

  .addConditionalEdges("validateContext", routeAfterValidation, [
    "generateResponse",
    "improveInput",
    "fallbackResponse",
  ])

  .addConditionalEdges("improveInput", routeAfterInputImprovement, [
    "retrieveContext",
    "fallbackResponse",
  ])

  .addEdge("generateResponse", "validateResponse")

  .addConditionalEdges("validateResponse", routeAfterResponseValidation, [
    "saveHistory",
    "regenerateResponse",
  ])

  .addEdge("regenerateResponse", "validateResponse")

  .addEdge("fallbackResponse", "saveHistory")

  // =================================
  // COMMON END
  // =================================

  .addEdge("saveHistory", END);

// ===================================
// COMPILE LANGGRAPH
// ===================================

export const applicationGraph = workflow.compile({
  checkpointer,
});
