import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  //   temperature: 0,
  temperature: 0.2,
  //   temperature: 1,
  maxTokens: 200,
});
