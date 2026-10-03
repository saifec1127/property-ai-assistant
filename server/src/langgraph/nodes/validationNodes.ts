import type { GraphStateType } from "../state";

import {
  contextValidationChain,
  inputImprovementChain,
  responseValidationChain,
  responseImprovementChain,
} from "../prompts/ragPrompts";


// ========================================
// VALIDATE RETRIEVED CONTEXT
// ========================================
//
// Pinecone se jo context mila,
// check karta hai useful hai ya nahi.
// ========================================
export async function validateContextNode(
  state: GraphStateType,
) {
  const result =
    await contextValidationChain.invoke({
      question: state.processedInput,
      context: state.context,
    });

  const normalizedResult =
    result.trim().toUpperCase();

  const isContextRelevant =
    normalizedResult === "GOOD";

  console.log(
    "\nContext Validation:",
    normalizedResult,
  );

  return {
    isContextRelevant,
  };
}


// ========================================
// IMPROVE SEARCH QUERY
// ========================================
//
// Agar Pinecone se useful context nahi mila,
// user ki query ko improve karta hai.
// ========================================
export async function improveInputNode(
  state: GraphStateType,
) {
  const currentInput =
    state.processedInput.trim();

  const improvedInput =
    await inputImprovementChain.invoke({
      originalInput: state.input,
      processedInput: currentInput,
      historyText: state.historyText,
    });

  const processedInput =
    improvedInput
      .trim()
      .replace(/^[\"']|[\"']$/g, "");

  const normalizedCurrentInput =
    currentInput
      .toLowerCase()
      .replace(/[?.!,]/g, "")
      .trim();

  const normalizedImprovedInput =
    processedInput
      .toLowerCase()
      .replace(/[?.!,]/g, "")
      .trim();

  const isQueryImproved =
    normalizedCurrentInput !==
    normalizedImprovedInput;

  const retryCount =
    state.retryCount + 1;

  console.log(
    "\nCurrent Search Query:",
    currentInput,
  );

  console.log(
    "\nImproved Search Query:",
    processedInput,
  );

  console.log(
    "Query Actually Changed:",
    isQueryImproved,
  );

  console.log(
    "Retry Count:",
    retryCount,
  );

  return {
    processedInput,
    retryCount,
    isQueryImproved,
  };
}


// ========================================
// VALIDATE GENERATED RESPONSE
// ========================================
//
// LLM ka answer retrieved context ke
// according valid hai ya nahi.
// ========================================
export async function validateResponseNode(
  state: GraphStateType,
) {
  const result =
    await responseValidationChain.invoke({
      question: state.processedInput,
      context: state.context,
      answer: state.output,
    });

  const normalizedResult =
    result.trim().toUpperCase();

  const isResponseValid =
    normalizedResult === "GOOD";

  console.log(
    "\nResponse Validation:",
    normalizedResult,
  );

  return {
    isResponseValid,
  };
}


// ========================================
// REGENERATE RESPONSE
// ========================================
//
// Agar response poor ho,
// improved response generate karta hai.
// ========================================
export async function regenerateResponseNode(
  state: GraphStateType,
) {
  const improvedOutput =
    await responseImprovementChain.invoke({
      question: state.processedInput,
      context: state.context,
      previousAnswer: state.output,
    });

  const output =
    improvedOutput.trim();

  const responseRetryCount =
    state.responseRetryCount + 1;

  console.log(
    "\nRegenerated Response:",
  );

  console.log(output);

  console.log(
    "Response Retry Count:",
    responseRetryCount,
  );

  return {
    output,
    responseRetryCount,
  };
}