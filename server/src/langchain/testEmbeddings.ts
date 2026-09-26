import "dotenv/config";

import { embeddings } from "./embeddings";

async function run() {
  const vector = await embeddings.embedQuery(
    "Hiba likes drawing."
  );

  console.log("Embedding:");
  console.log(vector);

  console.log("Vector Length:");
  console.log(vector.length);
}

run();