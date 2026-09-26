import { useEffect, useState } from "react";

import type { KeyboardEvent } from "react";

import { useLazyQuery } from "@apollo/client/react";

import { ASK_HIBA } from "../graphql/queries";

import type { ChatMessage } from "../types/chat.types";

type AskHibaResponse = {
  askHiba: {
    answer: string;
  };
};

type AskHibaVariables = {
  question: string;
  sessionId: string;
};

const RECENT_QUESTIONS_KEY = "hiba-recent-questions";

const SESSION_ID_KEY = "hiba-session-id";

function createSessionId() {
  return crypto.randomUUID();
}

function getInitialSessionId() {
  const savedSessionId = localStorage.getItem(SESSION_ID_KEY);

  if (savedSessionId) {
    return savedSessionId;
  }

  const newSessionId = createSessionId();

  localStorage.setItem(SESSION_ID_KEY, newSessionId);

  return newSessionId;
}

function getInitialRecentQuestions(): string[] {
  const savedQuestions = localStorage.getItem(RECENT_QUESTIONS_KEY);

  if (!savedQuestions) {
    return [];
  }

  try {
    const parsedQuestions = JSON.parse(savedQuestions);

    if (!Array.isArray(parsedQuestions)) {
      return [];
    }

    return parsedQuestions;
  } catch {
    return [];
  }
}

export function useHibaChat() {
  /* ===================================== */
  /* QUESTION INPUT */
  /* ===================================== */

  const [question, setQuestion] = useState("");

  /* ===================================== */
  /* CHAT MESSAGES */
  /* ===================================== */

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  /* ===================================== */
  /* SESSION ID */
  /* ===================================== */

  const [sessionId, setSessionId] = useState(getInitialSessionId);

  /* ===================================== */
  /* RECENT QUESTIONS */
  /* ===================================== */

  const [recentQuestions, setRecentQuestions] = useState<string[]>(
    getInitialRecentQuestions,
  );

  /* ===================================== */
  /* GRAPHQL QUERY */
  /* ===================================== */

  const [askHiba, { loading, error }] = useLazyQuery<
    AskHibaResponse,
    AskHibaVariables
  >(ASK_HIBA, {
    fetchPolicy: "no-cache",
  });

  /* ===================================== */
  /* SAVE RECENT QUESTIONS */
  /* ===================================== */

  useEffect(() => {
    localStorage.setItem(RECENT_QUESTIONS_KEY, JSON.stringify(recentQuestions));
  }, [recentQuestions]);

  /* ===================================== */
  /* INPUT CHANGE */
  /* ===================================== */

  function handleQuestionChange(value: string) {
    setQuestion(value);
  }

  /* ===================================== */
  /* ADD QUESTION TO RECENT LIST */
  /* ===================================== */

  function addRecentQuestion(questionText: string) {
    setRecentQuestions((previousQuestions) => {
      /*
          Remove the same question
          if it already exists.

          Example:

          Previous:
          [
            "Who is Hiba's father?",
            "Who is Maaz?"
          ]

          User asks again:
          "Who is Maaz?"

          We first remove old
          "Who is Maaz?"
        */

      const withoutDuplicate = previousQuestions.filter(
        (existingQuestion) =>
          existingQuestion.toLowerCase().trim() !==
          questionText.toLowerCase().trim(),
      );

      /*
          Put latest question
          at the beginning.

          Then keep only
          latest 5 questions.
        */

      return [questionText, ...withoutDuplicate].slice(0, 5);
    });
  }

  /* ===================================== */
  /* COMMON QUESTION SEND FUNCTION */
  /* ===================================== */

  async function sendQuestion(questionText: string) {
    const trimmedQuestion = questionText.trim();

    /*
      Empty question should
      not call backend.
    */

    if (!trimmedQuestion) {
      return;
    }

    /*
      If API request already
      running, don't send
      another request.
    */

    if (loading) {
      return;
    }

    /* =================================== */
    /* ADD USER MESSAGE TO UI */
    /* =================================== */

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((previousMessages) => [...previousMessages, userMessage]);

    /* =================================== */
    /* SAVE AS RECENT QUESTION */
    /* =================================== */

    addRecentQuestion(trimmedQuestion);

    /*
      Clear input after question
      has been submitted.
    */

    setQuestion("");

    try {
      /* ================================= */
      /* CALL GRAPHQL BACKEND */
      /* ================================= */

      const result = await askHiba({
        variables: {
          question: trimmedQuestion,

          sessionId,
        },
      });

      /*
        Backend GraphQL response:

        {
          data: {
            askHiba: {
              answer: "..."
            }
          }
        }
      */

      const answer = result.data?.askHiba?.answer;

      if (!answer) {
        throw new Error("No answer received from Hiba AI.");
      }

      /* ================================= */
      /* ADD AI RESPONSE TO UI */
      /* ================================= */

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);
    } catch (requestError) {
      /*
        Apollo error state will
        also be available through
        `error`.

        This log helps debugging.
      */

      console.error("Failed to ask Hiba:", requestError);
    }
  }

  /* ===================================== */
  /* NORMAL ASK BUTTON */
  /* ===================================== */

  async function handleAsk() {
    await sendQuestion(question);
  }

  /* ===================================== */
  /* GENERAL / RECENT QUESTION CLICK */
  /* ===================================== */

  async function handleSuggestionClick(questionText: string) {
    /*
      First show selected
      question in input.

      This makes click feel
      responsive to the user.
    */

    setQuestion(questionText);

    /*
      Important:

      We directly send
      questionText.

      We DON'T do:

      setQuestion(questionText);
      handleAsk();

      because React state update
      is asynchronous and
      handleAsk could receive
      old question state.
    */

    await sendQuestion(questionText);
  }

  /* ===================================== */
  /* ENTER KEY */
  /* ===================================== */

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !loading) {
      event.preventDefault();

      void handleAsk();
    }
  }

  /* ===================================== */
  /* CLEAR CHAT */
  /* ===================================== */

  function clearMessages() {
    /*
      Clear visible conversation.
    */

    setMessages([]);

    setQuestion("");

    /*
      Start a fresh backend
      LangGraph conversation.

      This is important because
      MongoDB/LangGraph remembers
      history using sessionId /
      thread_id.

      If we only clear React UI
      but keep old sessionId,
      backend can still remember
      previous conversation.
    */

    const newSessionId = createSessionId();

    setSessionId(newSessionId);

    localStorage.setItem(SESSION_ID_KEY, newSessionId);

    /*
      We intentionally DO NOT clear
      recentQuestions here.

      Clear Chat != Clear History

      Recent Questions remain visible.
    */
  }

  /* ===================================== */
  /* RETURN HOOK API */
  /* ===================================== */

  return {
    question,
    messages,
    loading,
    error,
    recentQuestions,

    handleQuestionChange,
    handleAsk,
    handleSuggestionClick,
    handleKeyDown,
    clearMessages,
  };
}
