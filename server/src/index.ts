import "dotenv/config";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

import { initializeHibaVectorStore } from "./langchain/vectorStore";

import { setupCheckpointer } from "./langgraph/checkpointer";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  console.log("Initializing MongoDB checkpointer...");

  await setupCheckpointer();

  console.log("MongoDB checkpointer initialized.");

  console.log("Initializing Hiba AI knowledge...");

  await initializeHibaVectorStore();

  console.log("Hiba AI knowledge initialized.");

  const { url } = await startStandaloneServer(server, {
    listen: {
      port: Number(process.env.PORT) || 5000,
    },
  });

  console.log(`GraphQL server running at ${url}`);
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);

  process.exit(1);
});