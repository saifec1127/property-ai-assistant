import type { GraphStateType } from "../state";


// ========================================
// PROPERTY RAG FALLBACK
// ========================================
export async function fallbackResponseNode(
  state: GraphStateType,
) {
  const output =
    "I don't have enough property information to answer that yet. You can ask me about properties, plots, flats, locations, prices, budgets, or property recommendations.";

  return {
    output,
  };
}