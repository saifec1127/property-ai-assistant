import "dotenv/config";

import { runApplicationGraph } from "./langgraph/runGraph";
import { applicationGraph } from "./langgraph/graph";

async function run() {
  // -----------------------------------
  // Same session id use karenge
  // taaki second message first message
  // ki conversation continue kare
  // -----------------------------------
  const sessionId = `property-graph-test-${Date.now()}`;

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
  // CHECK GRAPH STATE AFTER FIRST MESSAGE
  // =====================================

  const firstCheckpoint = await applicationGraph.getState({
    configurable: {
      thread_id: sessionId,
    },
  });

  console.log("\nCHECKPOINT AFTER FIRST MESSAGE:");

  console.log({
    input: firstCheckpoint.values.input,

    sessionId:
      firstCheckpoint.values.sessionId,

    intent:
      firstCheckpoint.values.intent,

    propertyReady:
      firstCheckpoint.values.propertyReady,

    propertyNextQuestion:
      firstCheckpoint.values.propertyNextQuestion,

    propertyRecommendations:
      firstCheckpoint.values.propertyRecommendations,

    output:
      firstCheckpoint.values.output,

    messages:
      firstCheckpoint.values.messages,
  });


  // =====================================
  // SECOND PROPERTY MESSAGE
  // =====================================

  console.log("\nSECOND PROPERTY MESSAGE");

  const secondOutput = await runApplicationGraph(
    "Semi furnished and I need parking",
    sessionId,
  );

  console.log("\nSecond Output:");
  console.log(secondOutput);


  // =====================================
  // CHECK GRAPH STATE AFTER SECOND MESSAGE
  // =====================================

  const secondCheckpoint = await applicationGraph.getState({
    configurable: {
      thread_id: sessionId,
    },
  });

  console.log(
    "\nCHECKPOINT AFTER SECOND MESSAGE:",
  );

  console.log({
    input:
      secondCheckpoint.values.input,

    sessionId:
      secondCheckpoint.values.sessionId,

    intent:
      secondCheckpoint.values.intent,

    propertyReady:
      secondCheckpoint.values.propertyReady,

    propertyNextQuestion:
      secondCheckpoint.values
        .propertyNextQuestion,

    propertyRecommendations:
      secondCheckpoint.values
        .propertyRecommendations,

    output:
      secondCheckpoint.values.output,

    messages:
      secondCheckpoint.values.messages,
  });
}

run().catch((error) => {
  console.error(
    "Property graph test failed:",
    error,
  );

  process.exit(1);
});