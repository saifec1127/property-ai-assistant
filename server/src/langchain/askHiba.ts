import {
  formatDocumentsAsContext,
  retrieveHibaDocuments,
} from "./retriever";

import {
  hibaChain,
} from "./chain";

import {
  addToChatHistory,
  formatChatHistory,
  getChatHistory,
} from "./chatHistory";

import {
  rewriteQuestion,
} from "./questionRewriter";


export async function askHiba(
  question: string,
  sessionId: string
) {
  // ========================================
  // STEP 1
  // Current session ki chat history nikalo
  // ========================================

  const history =
    getChatHistory(sessionId);


  // ========================================
  // STEP 2
  // Array history ko string me convert karo
  // ========================================

  const historyText =
    formatChatHistory(history);


  // ========================================
  // STEP 3
  // Follow-up question ko standalone banao
  // ========================================

  const standaloneQuestion =
    await rewriteQuestion(
      question,
      historyText
    );


  console.log(
    "\nOriginal Question:"
  );

  console.log(question);


  console.log(
    "\nChat History:"
  );

  console.log(
    historyText || "No previous history"
  );


  console.log(
    "\nStandalone Question:"
  );

  console.log(
    standaloneQuestion
  );


  // ========================================
  // STEP 4
  // Pinecone se relevant documents lao
  // ========================================

  const documents =
    await retrieveHibaDocuments(
      standaloneQuestion,
      4
    );


  // ========================================
  // STEP 5
  // Documents ko RAG context me convert karo
  // ========================================

  const context =
    formatDocumentsAsContext(
      documents
    );


  // ========================================
  // Temporary debug logs
  // ========================================

  console.log(
    "\n=============================="
  );

  console.log(
    "RETRIEVED CONTEXT"
  );

  console.log(
    "=============================="
  );

  console.log(context);

  console.log(
    "==============================\n"
  );


  // ========================================
  // STEP 6
  // Context + question LLM ko bhejo
  // ========================================

  const answer =
    await hibaChain.invoke({
      context,
      question:
        standaloneQuestion,
    });


  // ========================================
  // STEP 7
  // User message history me save karo
  // ========================================

  addToChatHistory(
    sessionId,
    {
      role: "user",
      content: question,
    }
  );


  // ========================================
  // STEP 8
  // AI answer history me save karo
  // ========================================

  addToChatHistory(
    sessionId,
    {
      role: "assistant",
      content: answer,
    }
  );


  // ========================================
  // STEP 9
  // Final answer return karo
  // ========================================

  return answer;
}