import "dotenv/config";

import { retrieveDomainDocuments } from "./retriever";

async function run() {
  const question = "Tell me about property options in Kareli, Prayagraj";

  const documents = await retrieveDomainDocuments(question, 4);

  console.log("\nQuestion:");
  console.log(question);

  console.log("\nRetrieved Documents:\n");

  documents.forEach((document, index) => {
    console.log(`--- Result ${index + 1} ---`);

    console.log("Source:", document.metadata.source);

    console.log("Category:", document.metadata.category);

    console.log("Content:");

    console.log(document.pageContent);

    console.log();
  });
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
