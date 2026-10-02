import "dotenv/config";

import { runApplicationGraph } from "./langgraph/runGraph";
import { applicationGraph } from "./langgraph/graph";

async function run() {
  // Har test ke liye new session id use karo
  const sessionId = "property-graph-test-1";

  // =====================================
  // FIRST PROPERTY MESSAGE
  // =====================================

  console.log("\nFIRST PROPERTY MESSAGE");

  const firstOutput = await runApplicationGraph(
    "I need a 3BHK flat in Sector 137 Noida around 80 lakh",
    sessionId,
  );

  console.log("\nFirst Output:");
  console.log(firstOutput);

  // =====================================
  // CHECK GRAPH STATE
  // =====================================

  const firstCheckpoint = await applicationGraph.getState({
    configurable: {
      thread_id: sessionId,
    },
  });

  console.log("\nCHECKPOINT AFTER FIRST MESSAGE:");

  console.log({
    input: firstCheckpoint.values.input,
    sessionId: firstCheckpoint.values.sessionId,

    intent: firstCheckpoint.values.intent,

    propertyReady: firstCheckpoint.values.propertyReady,

    propertyNextQuestion: firstCheckpoint.values.propertyNextQuestion,

    propertyRecommendations: firstCheckpoint.values.propertyRecommendations,

    output: firstCheckpoint.values.output,

    messages: firstCheckpoint.values.messages,
  });
}

run().catch((error) => {
  console.error("Property graph test failed:", error);

  process.exit(1);
});
