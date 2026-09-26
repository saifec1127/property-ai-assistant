import { applicationGraph } from "./graph";

export async function runApplicationGraph(
  input: string,
  sessionId: string,
): Promise<string> {
  const result = await applicationGraph.invoke(
    {
      input,
      sessionId,
      messages: [],
      historyText: "",
      processedInput: "",
      documents: [],
      context: "",
      isContextRelevant: false,
      retryCount: 0,
      isQueryImproved: false,
      output: "",
      isResponseValid: false,
      responseRetryCount: 0,
    },
    {
      configurable: {
        thread_id: sessionId,
      },
    },
  );

  return result.output;
}
