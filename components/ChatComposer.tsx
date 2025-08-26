import React, { useRef } from 'react';

interface ChatComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function ChatComposer({ value, onChange, onSend, disabled }: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <form
      className="sticky bottom-0 bg-blue-50 p-4 flex gap-2 border-t border-blue-100"
      onSubmit={e => { e.preventDefault(); onSend(); }}
      aria-label="Componer mensaje"
    >
      <label htmlFor="composer" className="sr-only">Mensaje</label>
      <textarea
        id="composer"
        ref={textareaRef}
        className="flex-1 rounded-2xl border border-blue-100 p-3 shadow resize-none focus-visible:ring-2 focus-visible:ring-blue-400"
        rows={1}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje..."
        aria-label="Mensaje"
        disabled={disabled}
      />
      <button
        type="submit"
        className="rounded-2xl bg-blue-600 text-white px-6 py-2 font-semibold shadow hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400"
        disabled={disabled || !value.trim()}
        aria-label="Enviar"
      >
        Enviar
      </button>
    </form>
  );
}
