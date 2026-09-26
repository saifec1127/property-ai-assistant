import "dotenv/config";

import {
  loadHibaDocuments
} from "./hibaDocumentLoader";

async function run() {
  const documents =
    await loadHibaDocuments();

  console.log(
    "Total Documents:",
    documents.length
  );

  documents.forEach(
    (document, index) => {
      console.log(
        `\nDocument ${index + 1}`
      );

      console.log(
        "Source:",
        document.metadata.source
      );

      console.log(
        "Category:",
        document.metadata.category
      );

      console.log(
        "Content:"
      );

      console.log(
        document.pageContent
      );
    }
  );
}

run();