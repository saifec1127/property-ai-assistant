export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type AskHibaData = {
  askHiba: {
    answer: string;
  };
};

export type AskHibaVariables = {
  question: string;
  sessionId: string;
};