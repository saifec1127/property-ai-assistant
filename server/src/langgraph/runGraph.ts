import { applicationGraph } from "./graph";

export async function runApplicationGraph(
  input: string,
  sessionId: string,
): Promise<string> {
  const result = await applicationGraph.invoke(
    {
      // =================================
      // COMMON INPUT
      // =================================
      input,
      sessionId,

      // =================================
      // CHAT HISTORY
      // =================================
      messages: [],
      historyText: "",

      // =================================
      // PROCESSED INPUT
      // =================================
      processedInput: "",

      // =================================
      // PROPERTY WORKFLOW STATE
      // =================================
      //
      // Intent intentionally yahan set
      // nahi kar rahe.
      //
      // detectIntentNode decide karega.
      // =================================

      propertyReady: false,

      propertyNextQuestion: "",

      propertyRecommendations: [],

      // =================================
      // RAG STATE
      // =================================
      documents: [],

      context: "",

      isContextRelevant: false,

      retryCount: 0,

      isQueryImproved: false,

      // =================================
      // FINAL RESPONSE STATE
      // =================================
      output: "",

      isResponseValid: false,

      responseRetryCount: 0,
    },
    {
      configurable: {
        // Same session/thread ki state
        // MongoDB checkpointer me persist hogi.
        thread_id: sessionId,
      },
    },
  );

  return result.output;
}
