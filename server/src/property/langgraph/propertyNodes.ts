import type { GraphStateType } from "../../langgraph/state";

import {
  processPropertyIntake,
  getPropertyRecommendations,
} from "../propertyServiceClient";

import {
  propertyRecommendationChain,
} from "../prompts/propertyRecommendationPrompt";


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
// Python FastAPI se ranked properties
// fetch karta hai aur GraphState me
// propertyRecommendations set karta hai.
// -----------------------------------
export async function propertyRecommendationsNode(
  state: GraphStateType,
) {
  const result =
    await getPropertyRecommendations(
      state.sessionId,
    );

  return {
    propertyRecommendations:
      result.recommendations ?? [],
  };
}

// -----------------------------------
// Generate Natural AI Response
//
// Python ne recommendation calculate
// kar di hai.
//
// Ab existing Node.js LangChain/OpenAI
// ranked property data ko user-friendly
// answer me convert karega.
// -----------------------------------
export async function generatePropertyResponseNode(
  state: GraphStateType,
) {
  // -----------------------------------
  // No recommendations case
  // -----------------------------------
  if (
    !state.propertyRecommendations ||
    state.propertyRecommendations.length === 0
  ) {
    return {
      output:
        "I could not find a suitable property matching your current preferences.",
    };
  }

  // -----------------------------------
  // Generate final natural response
  // -----------------------------------
  const output =
    await propertyRecommendationChain.invoke({
      question: state.input,

      // Abhi preferences Python session me hain,
      // but GraphState me directly store nahi kar rahe.
      // Recommendations me enough structured
      // information available hai.
      preferences:
        "Use the user's current property requirements from the conversation.",

      recommendations: JSON.stringify(
        state.propertyRecommendations,
        null,
        2,
      ),
    });

  return {
    output: output.trim(),
  };
}