import "dotenv/config";

import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing.");
}

export const mongoClient =
  new MongoClient(mongoUri);