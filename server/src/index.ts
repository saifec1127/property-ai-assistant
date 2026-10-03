import "dotenv/config";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

import { setupCheckpointer } from "./langgraph/checkpointer";

// ========================================
// APOLLO GRAPHQL SERVER
// ========================================
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// ========================================
// START APPLICATION SERVER
// ========================================
async function startServer() {
  // ======================================
  // STEP 1
  // Initialize MongoDB LangGraph Checkpointer
  // ======================================
  console.log("Initializing MongoDB checkpointer...");

  await setupCheckpointer();

  console.log("MongoDB checkpointer initialized.");

  // ======================================
  // STEP 2
  // Pinecone Initialization
  // ======================================
  //
  // IMPORTANT:
  //
  // Pinecone data is NOT created here.
  //
  // Property documents are indexed separately
  // using:
  //
  // npm run index:property
  //
  // At runtime, the retriever connects to the
  // existing Pinecone index when needed.
  // ======================================

  console.log(
    "Property AI knowledge will be retrieved from Pinecone when required.",
  );

  // ======================================
  // STEP 3
  // Start GraphQL Server
  // ======================================
  const { url } = await startStandaloneServer(server, {
    listen: {
      port: Number(process.env.PORT) || 5000,
    },
  });

  // ======================================
  // SERVER READY
  // ======================================
  console.log(`GraphQL server running at ${url}`);
}

// ========================================
// START SERVER
// ========================================
startServer().catch((error) => {
  console.error("Failed to start server:", error);

  process.exit(1);
});
