import React from 'react';

export default function TypingDots() {
  return (
    <span className="inline-block align-middle" aria-label="Escribiendo" aria-live="polite">
      <span className="dot dot1 bg-blue-400"></span>
      <span className="dot dot2 bg-blue-400"></span>
      <span className="dot dot3 bg-blue-400"></span>
      <style jsx>{`
        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin: 0 2px;
          opacity: 0.5;
          animation: typing 1.2s infinite;
        }
        .dot1 { animation-delay: 0s; }
        .dot2 { animation-delay: 0.2s; }
        .dot3 { animation-delay: 0.4s; }
        @keyframes typing {
          0%, 80%, 100% { opacity: 0.5; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-4px); }
        }
      `}</style>
    </span>
  );
}
