import "dotenv/config";

import { runApplicationGraph } from "./runGraph";

async function run() {
  const sessionId = "mongodb-persistence-test";

  const output = await runApplicationGraph(
    "Who is Hiba's father?",
    sessionId,
  );

  console.log("First Output:", output);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});