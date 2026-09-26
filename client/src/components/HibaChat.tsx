import ChatMessage from "./ChatMessage";

import { useHibaChat } from "../hooks/useHibaChat";

import "../styles/HibaChat.css";

const generalQuestions = [
  "Show me available 3BHK properties.",
  "Which properties are under ₹1 crore?",
  "What locations are available?",
  "Show me ready-to-move properties.",
];

function HibaChat() {
  const {
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
  } = useHibaChat();

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* ============================= */}
        {/* HEADER */}
        {/* ============================= */}

        <header className="chat-header">
          <div className="header-left">
            <div className="header-avatar">H</div>

            <div>
              <h1>Property AI Assistant</h1>

              <p>Your AI assistant for finding the right property</p>
            </div>
          </div>

          {messages.length > 0 && (
            <button className="clear-button" onClick={clearMessages}>
              Clear Chat
            </button>
          )}
        </header>

        {/* ============================= */}
        {/* MAIN CHAT AREA */}
        {/* ============================= */}

        <main className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-section">
              {/* Welcome Icon */}

              <div className="welcome-icon">✨</div>

              {/* Main Heading */}

              <h2>Find your ideal property</h2>

              <p>
                I can help you explore properties, locations, prices, amenities
                and availability.
              </p>

              {/* ============================= */}
              {/* GENERAL QUESTIONS */}
              {/* ============================= */}

              <div className="question-section">
                <h3 className="question-section-title">General Questions</h3>

                <div className="suggestion-list">
                  {generalQuestions.map((generalQuestion) => (
                    <button
                      key={generalQuestion}
                      type="button"
                      className="suggestion"
                      disabled={loading}
                      onClick={() =>
                        void handleSuggestionClick(generalQuestion)
                      }
                    >
                      {generalQuestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* ============================= */}
              {/* RECENT QUESTIONS */}
              {/* ============================= */}

              {recentQuestions.length > 0 && (
                <div
                  className="
                    question-section
                    recent-section
                  "
                >
                  <h3 className="question-section-title">Recent Questions</h3>

                  <div className="recent-question-list">
                    {recentQuestions.map((recentQuestion) => (
                      <button
                        key={recentQuestion}
                        type="button"
                        className="recent-question"
                        disabled={loading}
                        onClick={() =>
                          void handleSuggestionClick(recentQuestion)
                        }
                      >
                        <span className="recent-question-icon">↻</span>

                        <span>{recentQuestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}

          {/* ============================= */}
          {/* LOADING MESSAGE */}
          {/* ============================= */}

          {loading && (
            <div
              className="
                message-row
                message-row-assistant
              "
            >
              <div className="message-avatar">H</div>

              <div
                className="
                  message-bubble
                  assistant-message
                "
              >
                Thinking...
              </div>
            </div>
          )}

          {/* ============================= */}
          {/* ERROR */}
          {/* ============================= */}

          {error && (
            <div className="error-message">
              Something went wrong. Please try again.
            </div>
          )}
        </main>

        {/* ============================= */}
        {/* FOOTER */}
        {/* ============================= */}

        <footer className="chat-footer">
          <div className="input-container">
            <input
              value={question}
              placeholder="Ask about properties, locations, prices..."
              onChange={(event) => handleQuestionChange(event.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={() => void handleAsk()}
              disabled={loading || !question.trim()}
            >
              {loading ? "..." : "Ask"}
            </button>
          </div>

          <div className="technology-text">
            Powered by LangChain • RAG • LangGraph • OpenAI
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HibaChat;
