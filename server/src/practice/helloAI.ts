import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
});

const outputParser = new StringOutputParser();

const promptTemplate = new PromptTemplate({
  template: `
You are Hiba AI Assistant.

Use only the following information about Hiba:

{context}

Question:
{question}

Rules:
- Answer only from the provided information.
- Do not make up information.
- If the answer is not available, say:
  "I don't have that information about Hiba."
- Answer in simple language.
`,
  inputVariables: ["context", "question"],
});

// const chain = promptTemplate
//   .pipe(model)
//   .pipe(outputParser);

const chain = RunnableSequence.from([
  promptTemplate,
  model,
  outputParser,
]);

async function askHiba(question: string) {
  const hibaInfo = `
    Hiba likes drawing.
    Hiba enjoys listening to children's stories.
    Hiba likes playing with building blocks.
  `;

  const answer = await chain.invoke({
    context: hibaInfo,
    question,
  });

  return answer;
}

async function run() {
  const answer = await askHiba(
    "What activities does Hiba enjoy?"
  );

  console.log(answer);
}

run();