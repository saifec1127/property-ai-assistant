import "dotenv/config";

import { searchHibaVectorStore } from "./vectorStore";

async function run() {
  const results = await searchHibaVectorStore(
    "What creative activities does Hiba enjoy?",
    2
  );

  console.log("\nSearch Results:");

  results.forEach((result, index) => {
    console.log(`\nResult ${index + 1}`);
    console.log("----------------");

    console.log("Score:");
    console.log(result.score);

    console.log("\nContent:");
    console.log(result.pageContent);

    console.log("\nMetadata:");
    console.log(result.metadata);
  });
}

run();