import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

import { model } from "./model";
import { hibaPrompt } from "./prompt";

const outputParser = new StringOutputParser();

export const hibaChain = RunnableSequence.from([
  hibaPrompt,
  model,
  outputParser,
]);