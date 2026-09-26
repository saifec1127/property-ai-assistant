// import "dotenv/config";
// import { ChatOpenAI } from "@langchain/openai";

// const model = new ChatOpenAI({
//   model: "gpt-4o-mini",
// });

// async function run() {
//   const hibaInfo = `
//     Hiba likes drawing.
//     Hiba enjoys listening to children's stories.
//     Hiba likes playing with building blocks.
//   `;

//   const response = await model.invoke(`
//     You are Hiba AI Assistant.

//     Use only the following information about Hiba:
//     ${hibaInfo}

//     Question:
//     What activities does Hiba enjoy?

//     Answer in simple language.
//   `);

//   console.log(response.content);
// }

// run();