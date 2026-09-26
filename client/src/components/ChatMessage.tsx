import type {
  ChatMessage as ChatMessageType,
} from "../types/chat.types";

type ChatMessageProps = {
  message: ChatMessageType;
};

function ChatMessage({
  message,
}: ChatMessageProps) {
  const isUser =
    message.role === "user";

  return (
    <div
      className={`message-row ${
        isUser
          ? "message-row-user"
          : "message-row-assistant"
      }`}
    >
      {!isUser && (
        <div className="message-avatar">
          H
        </div>
      )}

      <div
        className={`message-bubble ${
          isUser
            ? "user-message"
            : "assistant-message"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export default ChatMessage;