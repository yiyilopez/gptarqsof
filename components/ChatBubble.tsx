import React from 'react';
import { Role } from '../lib/types';
import { renderMarkdown } from '../lib/markdown';

interface ChatBubbleProps {
  role: Role;
  content: string;
  isStreaming?: boolean;
  onCopy?: () => void;
}

export default function ChatBubble({ role, content, isStreaming, onCopy }: ChatBubbleProps) {
  const isUser = role === 'user';
  return (
    <div
      className={`flex w-full my-2 ${isUser ? 'justify-end' : 'justify-start'}`}
      role="listitem"
      aria-live="polite"
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow border border-blue-100 bg-white relative animate-fade-in ${isUser ? 'ml-auto text-right bg-blue-50' : 'mr-auto text-left bg-white'}`}
      >
        <div className="text-xs text-blue-400 mb-1">{isUser ? 'Tú' : 'Asistente'}</div>
        <div className="prose prose-blue break-words text-blue-900">{renderMarkdown(content)}</div>
        {content.match(/```[\s\S]*?```|`[^`]+`/) && (
          <button
            className="absolute top-2 right-2 text-xs text-blue-400 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400"
            onClick={onCopy}
            aria-label="Copiar código"
          >
            Copiar
          </button>
        )}
        {isStreaming && (
          <span className="ml-2"><span className="sr-only">Escribiendo</span><span className="inline-block align-middle"><span className="dot dot1"></span><span className="dot dot2"></span><span className="dot dot3"></span></span></span>
        )}
      </div>
    </div>
  );
}
