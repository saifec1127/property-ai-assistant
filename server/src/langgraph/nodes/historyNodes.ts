import type { GraphStateType } from "../state";


// ========================================
// LOAD CONVERSATION HISTORY
// ========================================
export async function loadHistoryNode(
  state: GraphStateType,
) {
  const historyText = state.messages
    .map((message) => {
      const speaker =
        message.role === "user"
          ? "User"
          : "Assistant";

      return `${speaker}: ${message.content}`;
    })
    .join("\n");

  return {
    historyText,
  };
}


// ========================================
// SAVE CONVERSATION HISTORY
// ========================================
export async function saveHistoryNode(
  state: GraphStateType,
) {
  return {
    messages: [
      {
        role: "user" as const,
        content: state.input,
      },
      {
        role: "assistant" as const,
        content: state.output,
      },
    ],
  };
}