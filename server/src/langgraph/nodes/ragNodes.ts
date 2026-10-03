import type { GraphStateType } from "../state";

import { rewriteQuestion } from "../../langchain/questionRewriter";

import {
  formatDocumentsAsContext,
  retrieveDomainDocuments,
} from "../../langchain/retriever";

import { hibaChain } from "../../langchain/chain";


// ========================================
// PROCESS USER INPUT
// ========================================
export async function processInputNode(
  state: GraphStateType,
) {
  const processedInput =
    await rewriteQuestion(
      state.input,
      state.historyText,
    );

  return {
    processedInput,
  };
}


// ========================================
// RETRIEVE RAG CONTEXT
// ========================================
export async function retrieveContextNode(
  state: GraphStateType,
) {
  console.log(
    "\nSearching Pinecone for:",
  );

  console.log(state.processedInput);

  const documents =
    await retrieveDomainDocuments(
      state.processedInput,
      8,
    );

  console.log("\nRetrieved Documents:");

  documents.forEach(
    (document, index) => {
      console.log(
        `${index + 1}. ${
          document.metadata.source ??
          "unknown"
        }`,
      );
    },
  );

  const context =
    formatDocumentsAsContext(
      documents,
    );

  return {
    documents,
    context,
  };
}


// ========================================
// GENERATE RAG RESPONSE
// ========================================
export async function generateResponseNode(
  state: GraphStateType,
) {
  console.log(
    "\n==============================",
  );

  console.log(
    "FINAL CONTEXT SENT TO LLM",
  );

  console.log(
    "==============================",
  );

  console.log(state.context);

  console.log(
    "==============================\n",
  );

  const output =
    await hibaChain.invoke({
      context: state.context,
      question: state.processedInput,
    });

  return {
    output,
  };
}