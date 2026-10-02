import { applicationGraph } from "./graph";

export async function runApplicationGraph(
  input: string,
  sessionId: string,
): Promise<string> {
  const result = await applicationGraph.invoke(
    {
      // -----------------------------------
      // Common User Input
      // -----------------------------------
      input,
      sessionId,

      // -----------------------------------
      // Chat History
      // -----------------------------------
      messages: [],
      historyText: "",

      // -----------------------------------
      // Processed / Rewritten Input
      // -----------------------------------
      processedInput: "",

      // -----------------------------------
      // Property Workflow State
      // -----------------------------------

      // Initially hume nahi pata query
      // property hai ya general.
      // detectIntentNode baad me isko update karega.
      intent: "general",

      // Initially recommendation ke liye
      // information complete nahi maante.
      propertyReady: false,

      // Python service agar follow-up question
      // bhejegi to yahan store hoga.
      propertyNextQuestion: "",

      // Python recommendation service se
      // properties yahan store hongi.
      propertyRecommendations: [],

      // -----------------------------------
      // Existing RAG State
      // -----------------------------------
      documents: [],
      context: "",

      isContextRelevant: false,

      retryCount: 0,

      isQueryImproved: false,

      // -----------------------------------
      // Final Response
      // -----------------------------------
      output: "",

      isResponseValid: false,

      responseRetryCount: 0,
    },
    {
      configurable: {
        // Same conversation/session ko
        // LangGraph checkpointer identify karega.
        thread_id: sessionId,
      },
    },
  );

  return result.output;
}
