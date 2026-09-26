export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const chatSessions =
  new Map<string, ChatMessage[]>();


// ========================================
// Get chat history for a session
// ========================================

export function getChatHistory(
  sessionId: string
): ChatMessage[] {
  return (
    chatSessions.get(sessionId) ?? []
  );
}


// ========================================
// Add one message to chat history
// ========================================

export function addToChatHistory(
  sessionId: string,
  message: ChatMessage
): void {
  const history =
    chatSessions.get(sessionId) ?? [];

  history.push(message);

  chatSessions.set(
    sessionId,
    history
  );
}


// ========================================
// Convert ChatMessage[] into string
// ========================================

export function formatChatHistory(
  history: ChatMessage[]
): string {
  if (history.length === 0) {
    return "";
  }

  return history
    .map((message) => {
      const speaker =
        message.role === "user"
          ? "User"
          : "Assistant";

      return `${speaker}: ${message.content}`;
    })
    .join("\n");
}


// ========================================
// Clear one session
// ========================================

export function clearChatHistory(
  sessionId: string
): void {
  chatSessions.delete(sessionId);
}