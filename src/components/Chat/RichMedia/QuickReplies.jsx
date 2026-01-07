import React from 'react';

const QuickReplies = ({ items, onSelect }) => {
  if (!items) return null;
  return (
    <div className="quick-replies">
      {items.map((item, index) => (
        <button
          key={index}
          className="quick-reply-btn"
          onClick={() => onSelect(item.value || item.label || item)}
        >
          {item.label || item}
        </button>
      ))}
      <style>{`
        .quick-replies {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 10px;
        }
        .quick-reply-btn {
          background: #fff;
          border: 1px solid var(--pk-primary);
          color: var(--pk-primary);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .quick-reply-btn:hover {
          background: var(--pk-primary);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default QuickReplies;
