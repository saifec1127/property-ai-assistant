import { gql } from "@apollo/client";

export const ASK_HIBA = gql`
  query AskHiba(
    $question: String!
    $sessionId: String!
  ) {
    askHiba(
      question: $question
      sessionId: $sessionId
    ) {
      answer
    }
  }
`;