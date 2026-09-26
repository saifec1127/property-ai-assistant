import "dotenv/config";

import {
  retrieveHibaDocuments,
} from "./retriever";

async function run() {
  const question =
    "Who is Hiba's father?";

  const documents =
    await retrieveHibaDocuments(
      question,
      4
    );

  console.log("\nQuestion:");
  console.log(question);

  console.log(
    "\nRetrieved Documents:\n"
  );

  documents.forEach(
    (document, index) => {
      console.log(
        `--- Result ${index + 1} ---`
      );

      console.log(
        "Source:",
        document.metadata.source
      );

      console.log(
        "Category:",
        document.metadata.category
      );

      console.log("Content:");

      console.log(
        document.pageContent
      );

      console.log();
    }
  );
}

run();