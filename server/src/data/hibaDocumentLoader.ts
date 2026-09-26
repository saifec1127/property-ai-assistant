import fs from "fs/promises";
import path from "path";

import { Document } from "@langchain/core/documents";

import { hibaDataFiles } from "./hibaDataFiles";

export async function loadHibaDocuments() {
  const documents: Document[] = [];

  for (const dataFile of hibaDataFiles) {
    const filePath = path.resolve(
      process.cwd(),
      "../data",
      dataFile.fileName
    );

    const content = await fs.readFile(
      filePath,
      "utf-8"
    );

    const document = new Document({
      pageContent: content,
      metadata: {
        source: dataFile.fileName,
        category: dataFile.category,
      },
    });

    documents.push(document);
  }

  return documents;
}