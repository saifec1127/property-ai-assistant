import type { GraphStateType } from "../../langgraph/state";

import {
  processPropertyIntake,
  getPropertyRecommendations,
} from "../propertyServiceClient";


// -----------------------------------
// Property Intake Node
//
// User message Python FastAPI ko bhejta hai.
// Python preferences extract karta hai.
// -----------------------------------
export async function propertyIntakeNode(
  state: GraphStateType,
) {
  const result =
    await processPropertyIntake(
      state.sessionId,
      state.input,
    );

  return {
    propertyReady:
      result.ready_for_recommendation,

    propertyNextQuestion:
      result.next_question ?? "",
  };
}


// -----------------------------------
// Property Follow-Up Node
//
// Agar Python bole ki information
// incomplete hai, uska next question
// final output bana dete hain.
// -----------------------------------
export async function propertyFollowUpNode(
  state: GraphStateType,
) {
  return {
    output: state.propertyNextQuestion,
  };
}


// -----------------------------------
// Get Property Recommendations Node
//
// Jab enough information mil jaye,
// Python recommendation endpoint call hoga.
//
// Abhi testing ke liye simple text output
// bhi bana rahe hain.
//
// Later isi jagah AI-generated natural
// response add karenge.
// -----------------------------------
export async function propertyRecommendationsNode(
  state: GraphStateType,
) {
  const result =
    await getPropertyRecommendations(
      state.sessionId,
    );

  const recommendations =
    result.recommendations ?? [];

  // Agar koi property nahi mili
  if (recommendations.length === 0) {
    return {
      propertyRecommendations: [],
      output:
        "I could not find any matching properties for your current preferences.",
    };
  }

  // Top 3 recommendations
  const topRecommendations =
    recommendations.slice(0, 3);

  // Temporary readable response
  const recommendationText =
    topRecommendations
      .map(
        (property: any, index: number) =>
          `${index + 1}. ${property.title} - Match Score: ${property.match_score}`,
      )
      .join("\n");

  return {
    propertyRecommendations:
      recommendations,

    output:
      `I found ${recommendations.length} matching properties:\n${recommendationText}`,
  };
}