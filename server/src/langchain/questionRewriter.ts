import {
  PromptTemplate,
} from "@langchain/core/prompts";

import {
  StringOutputParser,
} from "@langchain/core/output_parsers";

import {
  RunnableSequence,
} from "@langchain/core/runnables";

import { model } from "./model";


const rewritePrompt =
  new PromptTemplate({
    template: `
You rewrite property-related follow-up questions into clear standalone questions for semantic retrieval.

Previous conversation:
{chatHistory}

Current question:
{question}

Rules:

1. Resolve references such as:
   - it
   - that area
   - this property
   - there
   - that flat
   - that plot
   using the previous conversation.

2. Preserve property requirements such as:
   - city
   - locality
   - budget
   - BHK
   - property type
   - furnishing
   - parking
   - plot size
   - legal/property topic

3. Do not answer the question.

4. Only rewrite the question.

5. If the question is already clear and standalone, preserve its meaning.

Examples:

Previous conversation:
User: Tell me about Kareli.

Current question:
What flats are available there?

Standalone question:
What flats are available in Kareli, Prayagraj?


Previous conversation:
User: Tell me about property registration in Uttar Pradesh.

Current question:
What documents are needed?

Standalone question:
What documents are generally needed for property registration in Uttar Pradesh?


Previous conversation:
User: Show me a plot in Naini.

Current question:
What about its legal checks?

Standalone question:
What legal checks should be performed before buying a residential plot in Naini, Prayagraj?

Now rewrite the current question.

Standalone question:
`,
    inputVariables: [
      "chatHistory",
      "question",
    ],
  });


const outputParser =
  new StringOutputParser();


const rewriteChain =
  RunnableSequence.from([
    rewritePrompt,
    model,
    outputParser,
  ]);


export async function rewriteQuestion(
  question: string,
  chatHistory: string,
) {
  const rewrittenQuestion =
    await rewriteChain.invoke({
      chatHistory:
        chatHistory.trim() ||
        "No previous conversation.",

      question,
    });

  return rewrittenQuestion
    .trim()
    .replace(
      /^["']|["']$/g,
      "",
    );
}