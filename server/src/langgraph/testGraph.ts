import "dotenv/config";

import { runApplicationGraph } from "./runGraph";
import { applicationGraph } from "./graph";

async function run() {
  const sessionId = "langgraph-native-history-test";

  // =====================================
  // FIRST QUESTION
  // =====================================

  console.log("\nFIRST QUESTION");

  const firstOutput = await runApplicationGraph(
    "Who is Hiba's father?",
    sessionId,
  );

  console.log("First Output:", firstOutput);

  // Read checkpoint after first graph run
  const firstCheckpoint = await applicationGraph.getState({
    configurable: {
      thread_id: sessionId,
    },
  });

  console.log("\nCHECKPOINT AFTER FIRST QUESTION:");

  console.log({
    input: firstCheckpoint.values.input,
    sessionId: firstCheckpoint.values.sessionId,
    processedInput: firstCheckpoint.values.processedInput,
    output: firstCheckpoint.values.output,
    retryCount: firstCheckpoint.values.retryCount,

    messages: firstCheckpoint.values.messages,
  });

  // =====================================
  // SECOND QUESTION
  // =====================================

  console.log("\nSECOND QUESTION");

  const secondOutput = await runApplicationGraph("And mother?", sessionId);

  console.log("Second Output:", secondOutput);

  // Read checkpoint after second graph run
  const secondCheckpoint = await applicationGraph.getState({
    configurable: {
      thread_id: sessionId,
    },
  });

  console.log("\nCHECKPOINT AFTER SECOND QUESTION:");

  console.log({
    input: secondCheckpoint.values.input,
    sessionId: secondCheckpoint.values.sessionId,
    processedInput: secondCheckpoint.values.processedInput,
    output: secondCheckpoint.values.output,
    retryCount: secondCheckpoint.values.retryCount,

    messages: secondCheckpoint.values.messages,
  });
}

run().catch((error) => {
  console.error("Graph test failed:", error);

  process.exit(1);
});
