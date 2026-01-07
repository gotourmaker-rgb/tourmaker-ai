import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { useChat } from '../../hooks/useChat';

const ChatInterface = () => {
  const { messages, isTyping, sendMessage } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="chat-container">
      <div className="messages-area">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onReply={sendMessage} />
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span>.</span><span>.</span><span>.</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <InputArea onSend={sendMessage} disabled={isTyping} />

      <style>{`
        .chat-container {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: var(--sp-md);
          display: flex;
          flex-direction: column;
          scroll-behavior: smooth;
        }

        /* Hide scrollbar for cleaner look */
        .messages-area::-webkit-scrollbar {
          width: 6px;
        }
        .messages-area::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 4px;
        }

        .typing-indicator {
          padding: var(--sp-md);
          color: hsl(var(--tc-muted));
          font-size: 1.5rem;
          line-height: 0.5;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
