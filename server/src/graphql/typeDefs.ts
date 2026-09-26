export const typeDefs = `#graphql
  type AIResponse {
    answer: String!
  }

  type Query {
    askHiba(
      question: String!
      sessionId: String!
    ): AIResponse!
  }
`;