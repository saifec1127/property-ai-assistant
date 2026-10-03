import type { GraphStateType } from "./state";


// ========================================
// MAIN INTENT DETECTION NODE
// ========================================
//
// Ye node decide karta hai ki user ka
// current message kis workflow me jayega.
//
// Possible intents:
//
// greeting
// property
// property_knowledge
// out_of_domain
// ========================================
export async function detectIntentNode(
  state: GraphStateType,
) {
  const input = state.input
    .toLowerCase()
    .trim();


  // =====================================
  // 1. GREETING DETECTION
  // =====================================
  //
  // Example:
  //
  // "Hi"
  // "Hello"
  // "Hey"
  //
  // In cases me:
  // Pinecone nahi
  // FastAPI nahi
  // OpenAI unnecessary nahi
  // =====================================
  const greetingKeywords = [
    "hi",
    "hello",
    "hey",
    "hii",
    "hiii",
    "good morning",
    "good afternoon",
    "good evening",
  ];

  const isGreeting =
    greetingKeywords.includes(input);

  if (isGreeting) {
    return {
      intent: "greeting" as const,
    };
  }


  // =====================================
  // 2. PROPERTY SEARCH / RECOMMENDATION
  // =====================================
  //
  // User actual property search kar raha
  // hai ya recommendation chahta hai.
  //
  // Example:
  //
  // "I need a 3BHK flat"
  // "Show me a plot in Kareli"
  // "I want land under 50 lakh"
  // =====================================
  const propertyKeywords = [
    "property",
    "plot",
    "land",
    "flat",
    "apartment",
    "bhk",
    "house",
    "furnished",
    "furnishing",
    "parking",
    "budget",
    "sqft",
    "square feet",
    "investment",
    "buy property",
    "buy flat",
    "buy plot",
  ];

  const hasPropertyKeyword =
    propertyKeywords.some((keyword) =>
      input.includes(keyword),
    );


  // =====================================
  // 3. PREVIOUS PROPERTY CONVERSATION
  // =====================================
  //
  // Example:
  //
  // User:
  // "I want to buy property"
  //
  // Assistant:
  // "Which city and area?"
  //
  // User:
  // "Prayagraj, Kareli"
  //
  // Second user message me property keyword
  // zaroori nahi hoga.
  //
  // Isliye previous intent check karte hain.
  //
  // NOTE:
  // Ye abhi basic solution hai.
  // Later activeWorkflow add karke aur
  // reliable banayenge.
  // =====================================
  const wasPropertyConversation =
    state.intent === "property";


  // =====================================
  // 4. PROPERTY SEARCH FINAL CHECK
  // =====================================
  const isPropertyQuery =
    hasPropertyKeyword ||
    wasPropertyConversation;

  if (isPropertyQuery) {
    return {
      intent: "property" as const,
    };
  }


  // =====================================
  // 5. PROPERTY KNOWLEDGE DETECTION
  // =====================================
  //
  // User property listing nahi maang raha,
  // but property/location related information
  // maang raha hai.
  //
  // Example:
  //
  // "Kareli area kaisa hai?"
  // "Stamp duty kya hoti hai?"
  // "Registry process kya hai?"
  // "Naini ki connectivity kaisi hai?"
  //
  // Ye queries RAG / Pinecone me jayengi.
  // =====================================
  const propertyKnowledgeKeywords = [
    "area",
    "location",
    "locality",
    "registry",
    "registration",
    "stamp duty",
    "circle rate",
    "loan",
    "home loan",
    "connectivity",
    "neighborhood",
    "neighbourhood",
    "amenities",
    "builder",
    "society",
  ];

  const isPropertyKnowledge =
    propertyKnowledgeKeywords.some(
      (keyword) =>
        input.includes(keyword),
    );

  if (isPropertyKnowledge) {
    return {
      intent:
        "property_knowledge" as const,
    };
  }


  // =====================================
  // 6. OUT OF DOMAIN
  // =====================================
  //
  // Agar query property domain se related
  // nahi hai to out_of_domain.
  //
  // Example:
  //
  // "Who is Virat Kohli?"
  // "What is JavaScript?"
  // "Who won the match?"
  //
  // Is case me assistant general answer
  // nahi dega.
  //
  // User ko politely property topics ki
  // taraf redirect karega.
  // =====================================
  return {
    intent:
      "out_of_domain" as const,
  };
}


// ========================================
// GREETING RESPONSE NODE
// ========================================
//
// Greeting ke liye direct response.
//
// No FastAPI
// No Pinecone
// No OpenAI
//
// Faster + cheaper.
// ========================================
export async function greetingNode() {
  return {
    output:
      "Hi! I am your Property AI Assistant. I can help you find flats and plots, compare locations, explore options by budget, and recommend properties in Prayagraj.",
  };
}


// ========================================
// OUT OF DOMAIN RESPONSE NODE
// ========================================
//
// Property domain se unrelated query ke
// liye friendly redirect.
//
// Example:
//
// User:
// "Who is Virat Kohli?"
//
// Assistant:
// General cricket answer dene ke bajaye
// property-related help offer karega.
// ========================================
export async function outOfDomainNode() {
  return {
    output:
      'That question is outside my property assistance scope. I can help you find flats or plots, compare locations, check options by budget, or recommend properties in Prayagraj. You can ask me things like: "Show me plots in Kareli under ₹50 lakh" or "Which area is good for a 3BHK in Prayagraj?"',
  };
}