import { END, START, StateGraph } from "@langchain/langgraph";

import { checkpointer } from "./checkpointer";

import { GraphState } from "./state";

import type { GraphStateType } from "./state";

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

// const checkpointer = new MemorySaver();

const workflow = new StateGraph(GraphState)

  .addNode("loadHistory", loadHistoryNode)

  .addNode("processInput", processInputNode)

  .addNode("retrieveContext", retrieveContextNode)

  .addNode("validateContext", validateContextNode)

  .addNode("improveInput", improveInputNode)

  .addNode("generateResponse", generateResponseNode)

  .addNode("validateResponse", validateResponseNode)

  .addNode("regenerateResponse", regenerateResponseNode)

  .addNode("fallbackResponse", fallbackResponseNode)

  .addNode("saveHistory", saveHistoryNode)

  .addEdge(START, "loadHistory")

  .addEdge("loadHistory", "processInput")

  .addEdge("processInput", "retrieveContext")

  .addEdge("retrieveContext", "validateContext")

  .addConditionalEdges("validateContext", routeAfterValidation, [
    "generateResponse",
    "improveInput",
    "fallbackResponse",
  ])

  // .addEdge("improveInput", "retrieveContext")

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

  .addEdge("saveHistory", END);

export const applicationGraph = workflow.compile({
  checkpointer,
});
