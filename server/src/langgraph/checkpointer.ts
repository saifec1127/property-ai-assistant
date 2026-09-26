import "dotenv/config";

import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";

import { mongoClient } from "./mongodb";

const dbName = process.env.MONGODB_DB_NAME ?? "hiba_ai";

export const checkpointer = new MongoDBSaver({
  client: mongoClient,
  dbName,
});

export async function setupCheckpointer() {
  const errors = await checkpointer.setup();

  if (errors.length > 0) {
    console.error("MongoDB checkpointer setup errors:", errors);
  } else {
    console.log("MongoDB checkpointer ready.");
  }
}
