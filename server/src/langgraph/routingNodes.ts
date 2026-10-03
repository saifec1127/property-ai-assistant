import type { GraphStateType } from "./state";

export async function detectIntentNode(
  state: GraphStateType,
) {
  const input = state.input.toLowerCase();

  const propertyKeywords = [
    "property",
    "plot",
    "land",
    "flat",
    "apartment",
    "bhk",
    "house",
    "furnished",
    "furnishing",
    "parking",
    "budget",
    "sqft",
    "square feet",
    "investment",
  ];

  // -----------------------------------
  // Check current message
  // -----------------------------------
  const hasPropertyKeyword =
    propertyKeywords.some((keyword) =>
      input.includes(keyword),
    );

  // -----------------------------------
  // Check previous graph state
  //
  // Agar previous session already
  // property flow me tha, to current
  // follow-up bhi property maana jayega.
  // -----------------------------------
  const wasPropertyConversation =
    state.intent === "property";

  // -----------------------------------
  // Final decision
  // -----------------------------------
  const isPropertyQuery =
    hasPropertyKeyword ||
    wasPropertyConversation;

  return {
    intent: isPropertyQuery
      ? "property"
      : "general",
  };
}