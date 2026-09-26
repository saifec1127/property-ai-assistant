// import "dotenv/config";
// import { ChatOpenAI } from "@langchain/openai";
// import { PromptTemplate } from "@langchain/core/prompts";

// const model = new ChatOpenAI({
//   model: "gpt-4o-mini",
// });

// const promptTemplate = new PromptTemplate({
//   template: `
// You are Hiba AI Assistant.

// Use only the following information about Hiba:

// {context}

// Question:
// {question}

// Answer in simple language.
// `,
//   inputVariables: ["context", "question"],
// });

// // async function run() {
// //   const hibaInfo = `
// //     Hiba likes drawing.
// //     Hiba enjoys listening to children's stories.
// //     Hiba likes playing with building blocks.
// //   `;

// //   const question = "What activities does Hiba enjoy?";

// //   const formattedPrompt = await promptTemplate.format({
// //     context: hibaInfo,
// //     question: question,
// //   });

// //   console.log("Formatted Prompt:");
// //   console.log(formattedPrompt);
// // }

// async function run() {
//   const hibaInfo = `
//     Hiba likes drawing.
//     Hiba enjoys listening to children's stories.
//     Hiba likes playing with building blocks.
//   `;

//   const question = "What activities does Hiba enjoy?";

//   const formattedPrompt = await promptTemplate.format({
//     context: hibaInfo,
//     question,
//   });

//   console.log("Formatted Prompt:");
//   console.log(formattedPrompt);

//   const response = await model.invoke(formattedPrompt);

//   console.log("AI Response:");
//   console.log(response.content);
// }

// run();