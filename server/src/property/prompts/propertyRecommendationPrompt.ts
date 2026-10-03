import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { model } from "../../langchain/model";


// -----------------------------------
// Property Recommendation Prompt
//
// Python already decides:
// - matching properties
// - match score
// - ranking
//
// LLM ka kaam sirf:
// structured data ko natural language
// me explain karna hai.
// -----------------------------------
const propertyRecommendationPrompt =
  new PromptTemplate({
    template: `
You are a helpful property recommendation assistant.

The user is looking for a property.

User's latest message:
{question}

User's property preferences:
{preferences}

Ranked property recommendations:
{recommendations}

Generate a clear and helpful response for the user.

Rules:

1. Use ONLY the property information provided above.

2. Do NOT invent:
   - price
   - location
   - amenities
   - property details
   - availability
   - match score

3. Recommendations are already ranked by the property recommendation engine.
   Do not change the ranking.

4. Explain why the top properties match the user's requirements.

5. Mention important differences.

For example:
- property is above budget,
- BHK does not exactly match,
- area is different,
- furnishing is different.

6. Show prices in an easy Indian format when possible.

Example:
7800000 → ₹78 lakh

7. Keep the answer conversational and easy to understand.

8. Do not mention internal technical details such as:
   MongoDB,
   FastAPI,
   Python,
   LangGraph,
   match algorithm,
   internal service.

9. If no recommendation is available, clearly tell the user that no suitable property was found.

10. Prefer the highest-ranked property first.

Return only the final answer for the user.
`,
    inputVariables: [
      "question",
      "preferences",
      "recommendations",
    ],
  });


// -----------------------------------
// LangChain LCEL Chain
//
// Prompt
//   ↓
// OpenAI Model
//   ↓
// String Output
// -----------------------------------
export const propertyRecommendationChain =
  propertyRecommendationPrompt
    .pipe(model)
    .pipe(new StringOutputParser());