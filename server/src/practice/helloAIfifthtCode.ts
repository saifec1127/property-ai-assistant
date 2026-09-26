// import "dotenv/config";
// import { ChatOpenAI } from "@langchain/openai";
// import { PromptTemplate } from "@langchain/core/prompts";
// import { StringOutputParser } from "@langchain/core/output_parsers";

// const model = new ChatOpenAI({
//   model: "gpt-4o-mini",
// });

// const outputParser = new StringOutputParser();

// const promptTemplate = new PromptTemplate({
//   template: `
// You are Hiba AI Assistant.

// Use only the following information about Hiba:

// {context}

// Question:
// {question}

// Rules:
// - Answer only from the provided information.
// - Do not make up information.
// - If the answer is not available, say:
//   "I don't have that information about Hiba."
// - Answer in simple language.
// `,
//   inputVariables: ["context", "question"],
// });

// // async function askHiba(question: string) {
// //   const hibaInfo = `
// //     Hiba likes drawing.
// //     Hiba enjoys listening to children's stories.
// //     Hiba likes playing with building blocks.
// //   `;

// //   const formattedPrompt = await promptTemplate.format({
// //     context: hibaInfo,
// //     question,
// //   });

// //   const response = await model.invoke(formattedPrompt);

// //   return response.content;
// // }

// async function askHiba(question: string) {
//   const hibaInfo = `
//     Hiba likes drawing.
//     Hiba enjoys listening to children's stories.
//     Hiba likes playing with building blocks.
//   `;

//   const formattedPrompt = await promptTemplate.format({
//     context: hibaInfo,
//     question,
//   });

//   const response = await model.invoke(formattedPrompt);

//   const parsedResponse = await outputParser.invoke(response);

//   return parsedResponse;
// }

// async function run() {
//   const answer = await askHiba(
//       "What activities does Hiba enjoy?"
//   );

//   console.log(answer);
// }

// run();