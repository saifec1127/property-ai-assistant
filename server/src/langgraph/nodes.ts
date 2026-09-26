import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { model } from "../langchain/model";

// import {
//   addToChatHistory,
//   formatChatHistory,
//   getChatHistory,
// } from "../langchain/chatHistory";

import { rewriteQuestion } from "../langchain/questionRewriter";

import {
  formatDocumentsAsContext,
  retrieveHibaDocuments,
} from "../langchain/retriever";

import { hibaChain } from "../langchain/chain";

import type { GraphStateType } from "./state";

const contextValidationPrompt = new PromptTemplate({
  template: `
You are a retrieval quality evaluator.

Your job is to determine whether the retrieved context contains enough information to COMPLETELY answer the user's question.

Question:
{question}

Retrieved Context:
{context}

Rules:

1. Return "GOOD" only if the context contains enough information to fully answer the question.

2. Pay special attention to:
   - all
   - every
   - list
   - names
   - plural people or relationships

3. A plural request such as "phuphus", "aunts", "brothers",
   "sisters", or "names" should be treated as requesting
   all matching entities available in the knowledge base.

4. Do not return "GOOD" just because one matching person exists
   when the question is plural.

5. Return "POOR" if:
   - required information is missing,
   - the context only partially answers the question,
   - or the context is irrelevant.

6. Do not answer the user's question.

7. Return exactly one word:

GOOD

or

POOR
`,
  inputVariables: ["question", "context"],
});

const contextValidationChain = contextValidationPrompt
  .pipe(model)
  .pipe(new StringOutputParser());

export async function validateContextNode(state: GraphStateType) {
  const result = await contextValidationChain.invoke({
    question: state.processedInput,
    context: state.context,
  });

  const normalizedResult = result.trim().toUpperCase();

  const isContextRelevant = normalizedResult === "GOOD";

  console.log("\nContext Validation:", normalizedResult);

  return {
    isContextRelevant,
  };
}

const inputImprovementPrompt = new PromptTemplate({
  template: `
You improve search queries for semantic retrieval.

Original user input:
{originalInput}

Current processed query:
{processedInput}

Conversation history:
{historyText}

The previous retrieval did not provide enough relevant context.

Rewrite the query so that a semantic vector search can retrieve better documents.

Rules:

1. Preserve the user's original intent.
2. Make the query explicit and standalone.
3. Expand ambiguous relationship words when useful.
4. Use clear English terms that are likely to appear in documents.
5. Do not answer the question.
6. Return only the improved search query.
7. The improved query MUST be meaningfully different from the current processed query.
8. If useful, add synonyms, alternate relationship terms,
   descriptive keywords, or related search terms.

Examples:

"phuphu name?"
→ "What are the names of Hiba's paternal aunts or father's sisters?"

"and mother?"
→ "What is the name of Hiba's mother?"

"dadi name?"
→ "What is the name of Hiba's paternal grandmother or father's mother?"
`,
  inputVariables: ["originalInput", "processedInput", "historyText"],
});

const inputImprovementChain = inputImprovementPrompt
  .pipe(model)
  .pipe(new StringOutputParser());

// export async function improveInputNode(state: GraphStateType) {
//   const improvedInput = await inputImprovementChain.invoke({
//     originalInput: state.input,
//     processedInput: state.processedInput,
//     historyText: state.historyText,
//   });

//   const processedInput = improvedInput.trim().replace(/^["']|["']$/g, "");

//   const retryCount = state.retryCount + 1;

//   console.log("\nImproved Search Query:");

//   console.log(processedInput);

//   console.log("Retry Count:", retryCount);

//   return {
//     processedInput,
//     retryCount,
//   };
// }

export async function improveInputNode(state: GraphStateType) {
  const currentInput = state.processedInput.trim();

  const improvedInput = await inputImprovementChain.invoke({
    originalInput: state.input,
    processedInput: currentInput,
    historyText: state.historyText,
  });

  const processedInput = improvedInput.trim().replace(/^["']|["']$/g, "");

  const normalizedCurrentInput = currentInput
    .toLowerCase()
    .replace(/[?.!,]/g, "")
    .trim();

  const normalizedImprovedInput = processedInput
    .toLowerCase()
    .replace(/[?.!,]/g, "")
    .trim();

  const isQueryImproved = normalizedCurrentInput !== normalizedImprovedInput;

  const retryCount = state.retryCount + 1;

  console.log("\nCurrent Search Query:");
  console.log(currentInput);

  console.log("\nImproved Search Query:");
  console.log(processedInput);

  console.log("Query Actually Changed:", isQueryImproved);

  console.log("Retry Count:", retryCount);

  return {
    processedInput,
    retryCount,
    isQueryImproved,
  };
}

const responseValidationPrompt = new PromptTemplate({
  template: `
You are an answer quality evaluator.

Your job is to determine whether the generated answer correctly and completely answers the user's question using only the retrieved context.

User Question:
{question}

Retrieved Context:
{context}

Generated Answer:
{answer}

Rules:

1. Return "GOOD" only if the answer is supported by the context.

2. The answer must directly answer the user's question.

3. The answer must not invent information.

4. If the user's question is plural, such as asking about:
   - phuphus
   - aunts
   - brothers
   - sisters
   - names
   - multiple people
   - all items

   then the answer must include all matching entities present
   in the retrieved context.

5. Do not return "GOOD" if the answer gives only one person
   while the context contains multiple matching people.

6. Return "POOR" if the answer:
   - misses important information,
   - only partially answers the question,
   - contains unsupported information,
   - or does not directly answer the question.

7. Do not rewrite or answer the question yourself.

8. Return exactly one word:

GOOD

or

POOR
`,
  inputVariables: ["question", "context", "answer"],
});

const responseValidationChain = responseValidationPrompt
  .pipe(model)
  .pipe(new StringOutputParser());

const responseImprovementPrompt = new PromptTemplate({
  template: `
You are an AI assistant.

The previous answer was incomplete or incorrect.

User Question:
{question}

Retrieved Context:
{context}

Previous Answer:
{previousAnswer}

Generate a better answer.

Rules:

1. Use ONLY the retrieved context.

2. Completely answer the user's question.

3. Do not invent information.

4. If the user asks for all names, all people, a list, or multiple items,
   include every relevant item available in the context.

5. Carefully inspect all retrieved documents, not just the first one.

6. Return only the improved final answer.
`,
  inputVariables: ["question", "context", "previousAnswer"],
});

const responseImprovementChain = responseImprovementPrompt
  .pipe(model)
  .pipe(new StringOutputParser());

// ========================================
// NODE 1
// Load conversation history
// ========================================

// export async function loadHistoryNode(state: GraphStateType) {
//   const history = getChatHistory(state.sessionId);

//   const historyText = formatChatHistory(history);

//   return {
//     historyText,
//   };
// }

export async function loadHistoryNode(state: GraphStateType) {
  const historyText = state.messages
    .map((message) => {
      const speaker = message.role === "user" ? "User" : "Assistant";

      return `${speaker}: ${message.content}`;
    })
    .join("\n");

  return {
    historyText,
  };
}

// ========================================
// NODE 2
// Process / rewrite user input
// ========================================

export async function processInputNode(state: GraphStateType) {
  const processedInput = await rewriteQuestion(state.input, state.historyText);

  return {
    processedInput,
  };
}

// ========================================
// NODE 3
// Retrieve relevant documents
// ========================================

// export async function retrieveContextNode(state: GraphStateType) {
//   const documents = await retrieveHibaDocuments(state.processedInput, 4);

//   const context = formatDocumentsAsContext(documents);

//   return {
//     documents,
//     context,
//   };
// }

// ========================================
// NODE 3
// Retrieve relevant documents
// ========================================

export async function retrieveContextNode(state: GraphStateType) {
  console.log("\nSearching Pinecone for:");
  console.log(state.processedInput);

  const documents = await retrieveHibaDocuments(state.processedInput, 8);

  console.log("\nRetrieved Documents:");

  documents.forEach((document, index) => {
    console.log(`${index + 1}. ${document.metadata.source ?? "unknown"}`);
  });

  const context = formatDocumentsAsContext(documents);

  return {
    documents,
    context,
  };
}

// ========================================
// NODE 4
// Generate final AI response
// ========================================

// export async function generateResponseNode(state: GraphStateType) {
//   const output = await hibaChain.invoke({
//     context: state.context,
//     question: state.processedInput,
//   });

//   return {
//     output,
//   };
// }

export async function generateResponseNode(state: GraphStateType) {
  console.log("\n==============================");

  console.log("FINAL CONTEXT SENT TO LLM");

  console.log("==============================");

  console.log(state.context);

  console.log("==============================\n");

  const output = await hibaChain.invoke({
    context: state.context,
    question: state.processedInput,
  });

  return {
    output,
  };
}

export async function validateResponseNode(state: GraphStateType) {
  const result = await responseValidationChain.invoke({
    question: state.processedInput,
    context: state.context,
    answer: state.output,
  });

  const normalizedResult = result.trim().toUpperCase();

  const isResponseValid = normalizedResult === "GOOD";

  console.log("\nResponse Validation:", normalizedResult);

  return {
    isResponseValid,
  };
}

export async function regenerateResponseNode(state: GraphStateType) {
  const improvedOutput = await responseImprovementChain.invoke({
    question: state.processedInput,
    context: state.context,
    previousAnswer: state.output,
  });

  const output = improvedOutput.trim();

  const responseRetryCount = state.responseRetryCount + 1;

  console.log("\nRegenerated Response:");

  console.log(output);

  console.log("Response Retry Count:", responseRetryCount);

  return {
    output,
    responseRetryCount,
  };
}

// ========================================
// FALLBACK NODE
// Used when relevant information is not found
// ========================================

export async function fallbackResponseNode(state: GraphStateType) {
  const output = "I don't have that information about Hiba.";

  console.log("\nFallback Response:");

  console.log(output);

  return {
    output,
  };
}

// ========================================
// NODE 5
// Save conversation
// ========================================

// export async function saveHistoryNode(state: GraphStateType) {
//   addToChatHistory(state.sessionId, {
//     role: "user",
//     content: state.input,
//   });

//   addToChatHistory(state.sessionId, {
//     role: "assistant",
//     content: state.output,
//   });

//   return {};
// }

export async function saveHistoryNode(state: GraphStateType) {
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
