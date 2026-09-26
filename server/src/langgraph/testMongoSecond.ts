import "dotenv/config";

import { runApplicationGraph } from "./runGraph";

async function run() {
  const sessionId = "mongodb-persistence-test";

  const output = await runApplicationGraph(
    "And mother?",
    sessionId,
  );

  console.log("Second Output:", output);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});