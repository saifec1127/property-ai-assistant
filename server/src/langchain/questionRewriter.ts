import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

import { model } from "./model";

const rewritePrompt = new PromptTemplate({
  template: `
You are helping rewrite user questions into clear standalone questions
for semantic retrieval.

Previous conversation:
{chatHistory}

Current question:
{question}

Rewrite the current question as a standalone question.

Rules:

- Resolve words like "she", "her", "it", "that", or "they"
  using the previous conversation.

- Do not answer the question.

- Only rewrite the question.

- If the question is already clear and standalone,
  preserve its meaning.

Family relationship normalization:

- phuphu / phuphi / fufi / phoophi
  means paternal aunt / father's sister

- phuphus / phuphis / fufis
  means paternal aunts / father's sisters

IMPORTANT:

If the user uses a plural relationship word such as:
"phuphus", "aunts", "names", "brothers", "sisters",
preserve the plural meaning.

Do not convert a plural request into a singular question.

Examples:

Question:
hiba ki phuphu ka naam?

Standalone question:
What is the name of Hiba's paternal aunt?

Question:
hibas phuphus name?

Standalone question:
What are the names of Hiba's paternal aunts?

Question:
tell all phuphus name of hiba

Standalone question:
What are the names of all of Hiba's paternal aunts?

Now rewrite the current question.

Standalone question:
`,
  inputVariables: ["chatHistory", "question"],
});

const outputParser = new StringOutputParser();

const rewriteChain = RunnableSequence.from([
  rewritePrompt,
  model,
  outputParser,
]);

export async function rewriteQuestion(question: string, chatHistory: string) {
  const rewrittenQuestion = await rewriteChain.invoke({
    chatHistory: chatHistory.trim() || "No previous conversation.",
    question,
  });

  return rewrittenQuestion.trim().replace(/^["']|["']$/g, "");
}
