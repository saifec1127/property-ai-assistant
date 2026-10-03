import "dotenv/config";

import { splitDomainDocuments } from "./domainTextSplitter";

async function run() {
  const chunks = await splitDomainDocuments();

  console.log("Total Chunks:", chunks.length);

  chunks.forEach((chunk, index) => {
    console.log("\n--------------------");

    console.log(`Chunk ${index + 1}`);

    console.log("--------------------");

    console.log(chunk.pageContent);

    console.log("\nMetadata:");

    console.log(chunk.metadata);
  });
}

run().catch((error) => {
  console.error("Text splitter test failed:", error);

  process.exit(1);
});
