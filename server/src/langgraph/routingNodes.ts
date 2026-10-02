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
  ];

  const isPropertyQuery =
    propertyKeywords.some((keyword) =>
      input.includes(keyword),
    );

  return {
    intent: isPropertyQuery
      ? "property"
      : "general",
  };
}