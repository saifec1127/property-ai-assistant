import "dotenv/config";

import { loadDomainDocuments } from "./domainDocumentLoader";

async function run() {
  const documents = await loadDomainDocuments();

  console.log("Total Documents:", documents.length);

  documents.forEach((document, index) => {
    console.log(`\n========================`);

    console.log(`Document ${index + 1}`);

    console.log(`========================`);

    console.log("Source:", document.metadata.source);

    console.log("Category:", document.metadata.category);

    console.log("Domain:", document.metadata.domain);

    console.log("\nContent Preview:");

    console.log(document.pageContent.slice(0, 500));
  });
}

run().catch((error) => {
  console.error("Document loader test failed:", error);

  process.exit(1);
});
