import fs from "fs/promises";
import path from "path";

import { Document } from "@langchain/core/documents";

import { domainDataFiles } from "./domainDataFiles";


// ========================================
// LOAD DOMAIN DOCUMENTS
// ========================================
//
// data/ folder ke registered markdown
// files ko read karta hai.
//
// Har markdown file ko LangChain
// Document me convert karta hai.
// ========================================
export async function loadDomainDocuments() {
  const documents: Document[] = [];


  // --------------------------------------
  // Registered property files ko one by one
  // load karo.
  // --------------------------------------
  for (const dataFile of domainDataFiles) {

    // Example final path:
    //
    // property-ai-assistant/
    // data/
    // prayagraj-flats.md
    //
    const filePath = path.resolve(
      process.cwd(),
      "../data",
      dataFile.fileName,
    );


    // ------------------------------------
    // Markdown file read karo
    // ------------------------------------
    const content = await fs.readFile(
      filePath,
      "utf-8",
    );


    // ------------------------------------
    // LangChain Document create karo
    // ------------------------------------
    const document = new Document({
      pageContent: content,

      metadata: {
        source: dataFile.fileName,
        category: dataFile.category,

        // Future filtering ke liye useful
        domain: "property",
      },
    });


    // ------------------------------------
    // Final documents array me add karo
    // ------------------------------------
    documents.push(document);
  }


  return documents;
}