import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { model } from "../../langchain/model";


// ========================================
// CONTEXT VALIDATION PROMPT
// ========================================
//
// Pinecone se jo context aaya hai,
// check karta hai ki user ke question ka
// answer dene ke liye enough hai ya nahi.
// ========================================
const contextValidationPrompt =
  new PromptTemplate({
    template: `
You are a retrieval quality evaluator.

Your job is to determine whether the retrieved context contains enough information to COMPLETELY answer the user's question.

Question:
{question}

Retrieved Context:
{context}

Rules:

1. Return "GOOD" only if the context contains enough information to fully answer the question.

2. Return "POOR" if:
   - required information is missing,
   - the context only partially answers the question,
   - or the context is irrelevant.

3. Do not answer the user's question.

4. Return exactly one word:

GOOD

or

POOR
`,
    inputVariables: [
      "question",
      "context",
    ],
  });


// ========================================
// CONTEXT VALIDATION CHAIN
// ========================================
export const contextValidationChain =
  contextValidationPrompt
    .pipe(model)
    .pipe(new StringOutputParser());


// ========================================
// INPUT IMPROVEMENT PROMPT
// ========================================
//
// Agar Pinecone se achha result nahi mila,
// query ko improve karta hai.
// ========================================
const inputImprovementPrompt =
  new PromptTemplate({
    template: `
You improve search queries for semantic retrieval.

Original user input:
{originalInput}

Current processed query:
{processedInput}

Conversation history:
{historyText}

The previous retrieval did not provide enough relevant context.

Rewrite the query so that a semantic vector search can retrieve better property information.

Rules:

1. Preserve the user's original intent.
2. Make the query explicit and standalone.
3. Keep the query related to property, location, flats, plots, land, budget, or real estate information.
4. Use clear English terms that are likely to appear in property documents.
5. Do not answer the question.
6. Return only the improved search query.
7. The improved query MUST be meaningfully different from the current processed query.
`,
    inputVariables: [
      "originalInput",
      "processedInput",
      "historyText",
    ],
  });


// ========================================
// INPUT IMPROVEMENT CHAIN
// ========================================
export const inputImprovementChain =
  inputImprovementPrompt
    .pipe(model)
    .pipe(new StringOutputParser());


// ========================================
// RESPONSE VALIDATION PROMPT
// ========================================
//
// LLM ka generated answer retrieved
// context ke according correct hai ya nahi.
// ========================================
const responseValidationPrompt =
  new PromptTemplate({
    template: `
You are an answer quality evaluator.

Your job is to determine whether the generated answer correctly answers the user's property-related question using only the retrieved context.

User Question:
{question}

Retrieved Context:
{context}

Generated Answer:
{answer}

Rules:

1. Return "GOOD" only if the answer is supported by the context.
2. The answer must directly answer the user's question.
3. The answer must not invent property information.
4. Do not accept unsupported prices, locations, amenities, availability, or property details.
5. Return "POOR" if the answer is incomplete, unsupported, irrelevant, or misleading.
6. Do not rewrite the answer yourself.
7. Return exactly one word:

GOOD

or

POOR
`,
    inputVariables: [
      "question",
      "context",
      "answer",
    ],
  });


// ========================================
// RESPONSE VALIDATION CHAIN
// ========================================
export const responseValidationChain =
  responseValidationPrompt
    .pipe(model)
    .pipe(new StringOutputParser());


// ========================================
// RESPONSE IMPROVEMENT PROMPT
// ========================================
//
// Agar first response poor ho,
// better response generate karta hai.
// ========================================
const responseImprovementPrompt =
  new PromptTemplate({
    template: `
You are a Property AI Assistant.

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
3. Do not invent property information.
4. Do not invent prices, locations, amenities, availability, or property details.
5. Keep the answer clear and useful.
6. Return only the improved final answer.
`,
    inputVariables: [
      "question",
      "context",
      "previousAnswer",
    ],
  });


// ========================================
// RESPONSE IMPROVEMENT CHAIN
// ========================================
export const responseImprovementChain =
  responseImprovementPrompt
    .pipe(model)
    .pipe(new StringOutputParser());