import "dotenv/config";

import { splitHibaDocuments } from "./hibaTextSplitter";

async function run() {
  const chunks = await splitHibaDocuments();

  console.log("Total Chunks:", chunks.length);

  chunks.forEach((chunk, index) => {
    console.log(`\n--------------------`);
    console.log(`Chunk ${index + 1}`);
    console.log(`--------------------`);

    console.log(chunk.pageContent);

    console.log("\nMetadata:");
    console.log(chunk.metadata);
  });
}

run();