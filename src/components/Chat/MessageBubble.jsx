import React from 'react';
import VehicleCard from './RichMedia/VehicleCard';
import PresetList from './RichMedia/PresetList';
import PaymentLink from './RichMedia/PaymentLink';
import MapView from './RichMedia/MapView';

import QuickReplies from './RichMedia/QuickReplies';
import AddressPicker from './RichMedia/AddressPicker';

const MessageBubble = ({ message, onReply }) => {
  const isAgent = message.sender === 'agent';

  const renderRichMedia = () => {
    if (!message.data) return null;
    switch (message.data.type) {
      case 'vehicle_card': return <VehicleCard data={message.data} />;
      case 'map_view': return <MapView data={message.data} />;
      case 'preset_list': return <PresetList data={message.data} />;
      case 'payment_link': return <PaymentLink data={message.data} />;
      case 'address_picker': return (
        <AddressPicker
          items={message.data.items}
          onSelect={(item) => onReply && onReply(`SELECTED_ADDRESS:${JSON.stringify(item)}`, true)}
        />
      );
      case 'quick_replies': return (
        <QuickReplies
          items={message.data.items}
          onSelect={(val) => onReply && onReply(val)}
        />
      );
      default: return null;
    }
  };

  const hasMap = message.data && message.data.type === 'map_view';

  return (
    <div className={`message-row ${isAgent ? 'agent-row' : 'user-row'}`}>
      {isAgent && <div className="agent-avatar">🤖</div>}

      <div className={`bubble-container ${isAgent ? 'agent-container' : 'user-container'} ${hasMap ? 'wide-bubble' : ''}`}>
        <div className={`bubble ${isAgent ? 'agent-bubble' : 'user-bubble'}`}>
          <div className="message-content">
            {message.text}
          </div>
          <span className="timestamp">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Render Rich Media below the bubble if agent */}
        {isAgent && message.data && (
          <div className="rich-media-container">
            {renderRichMedia()}
          </div>
        )}
      </div>

      <style>{`
        .message-row {
          display: flex;
          gap: var(--sp-sm);
          margin-bottom: var(--sp-md);
          align-items: flex-start; /* Changed to start for stacked media */
          opacity: 0;
          animation: fadeSlideUp 0.3s ease forwards;
        }

        .bubble-container {
           display: flex;
           flex-direction: column;
           max-width: 75%;
           transition: max-width 0.3s ease;
        }
        
        .bubble-container.wide-bubble {
            max-width: 95%; /* Expanded width for Map */
            width: 95%; /* Force width expansion */
        }

        .agent-container {
           align-items: flex-start;
        }
        .user-container {
           align-items: flex-end;
        }

        .agent-row {
          justify-content: flex-start;
        }

        .user-row {
          justify-content: flex-end;
        }

        .agent-avatar {
          width: 36px;
          height: 36px;
          background: hsl(var(--pk-accent));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          flex-shrink: 0;
        }

        .bubble {
          padding: var(--sp-md);
          border-radius: var(--rd-md);
          position: relative;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          line-height: 1.6;
          white-space: pre-wrap; /* Preserve newlines */
          width: 100%;
        }

        .agent-bubble {
          background: var(--glass-bg); /* Glassmorphism */
          border: 1px solid var(--glass-border);
          border-bottom-left-radius: 4px;
          color: hsl(var(--tc-main));
        }

        .user-bubble {
          background: hsl(var(--pk-primary));
          color: hsl(var(--tc-light));
          border-bottom-right-radius: 4px;
        }

        .timestamp {
          display: block;
          font-size: 0.7rem;
          margin-top: var(--sp-xs);
          opacity: 0.7;
          text-align: right;
        }

        .rich-media-container {
          width: 100%;
          animation: fadeIn 0.5s ease 0.3s forwards; /* Delay slightly */
          opacity: 0;
        }
        
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MessageBubble;
