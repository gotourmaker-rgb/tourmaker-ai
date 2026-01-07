import React, { useState } from 'react';

const InputArea = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || disabled) return;
        onSend(input);
        setInput('');
    };

    return (
        <form className="input-area glass-panel" onSubmit={handleSend}>
            <input
                type="text"
                className="chat-input"
                placeholder="Type your message..." // Korean: 메시지를 입력하세요...
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={disabled}
            />
            <button type="submit" className="send-btn btn-primary" disabled={disabled || !input.trim()}>
                Send
            </button>

            <style>{`
        .input-area {
          display: flex;
          padding: var(--sp-sm);
          gap: var(--sp-sm);
          margin-top: var(--sp-md);
          width: 100%;
          max-width: 800px;
          align-self: center;
        }

        .chat-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: var(--sp-sm) var(--sp-md);
          font-size: 1rem;
          font-family: inherit;
          color: hsl(var(--tc-main));
          outline: none;
        }

        .chat-input::placeholder {
          color: hsl(var(--tc-muted));
        }

        .send-btn {
          min-width: 80px;
        }
        
        .send-btn:disabled {
          background: hsl(var(--tc-muted));
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
        </form>
    );
};

export default InputArea;
