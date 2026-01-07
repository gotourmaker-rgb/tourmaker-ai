import React from 'react';
import ChatInterface from './components/Chat/ChatInterface';

function App() {
  return (
    <div className="app-container">
      <header className="app-header glass-panel">
        <div className="logo-area">
          <span className="logo-icon">✨</span>
          <h1 className="logo-text title-gradient">TourMaker</h1>
        </div>
      </header>

      <main className="main-content">
        <ChatInterface />
      </main>

      <footer className="app-footer">
        <p>© 2026 TourMaker AI. Korea's No.1 Premium Tour Consultant.</p>
      </footer>

      <style>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, hsl(var(--pk-background)) 0%, #eef2f6 100%);
          display: flex;
          flex-direction: column;
          padding: var(--sp-md);
        }

        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--sp-md) var(--sp-xl);
          margin-bottom: var(--sp-lg);
          height: 80px;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: var(--sp-sm);
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .main-content {
          flex: 1;
          display: flex;
          justify-content: center;
          overflow: hidden; /* For chat scroll */
        }

        .app-footer {
          margin-top: var(--sp-md);
          text-align: center;
          color: hsl(var(--tc-muted));
          font-size: 0.875rem;
          padding: var(--sp-sm);
        }
      `}</style>
    </div>
  );
}

export default App;
