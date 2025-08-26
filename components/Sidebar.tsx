"use client";
import React, { useState } from 'react';

interface SidebarProps {
  onNewConversation?: () => void;
  onClearHistory?: () => void;
  persist: boolean;
  setPersist: (v: boolean) => void;
  onSetToken?: (token: string) => void;
}

export default function Sidebar({
  onNewConversation,
  onClearHistory,
  persist,
  setPersist,
  onSetToken,
}: SidebarProps) {
  const [token, setToken] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-white border-r border-blue-100 shadow h-full flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between p-4 border-b border-blue-100">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed((c) => !c)}
          className="ml-2 text-blue-400 hover:text-blue-600 focus:outline-none"
        >
          <span aria-hidden>{collapsed ? '▶' : '◀'}</span>
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-2 p-4">
        <button
          className="rounded-2xl px-4 py-2 bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 focus-visible:ring-2 focus-visible:ring-blue-400"
          onClick={onNewConversation}
        >
          Nueva conversación
        </button>
        <button
          className="rounded-2xl px-4 py-2 bg-blue-50 text-blue-500 shadow hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-400"
          onClick={onClearHistory}
        >
          Borrar historial
        </button>
        <label className="flex items-center gap-2 mt-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={persist}
            onChange={e => setPersist(e.target.checked)}
            className="accent-blue-600"
          />
          Persistir en este navegador
        </label>
        <label className="block mt-4 text-xs text-blue-400">Token de acceso</label>
        <input
          type="text"
          value={token}
          onChange={e => {
            setToken(e.target.value);
            onSetToken?.(e.target.value);
          }}
          placeholder="Pega tu token aquí"
          className="w-full rounded px-2 py-1 border border-blue-100 focus:ring-2 focus:ring-blue-400"
          aria-label="Token de acceso"
        />
      </nav>
    </aside>
  );
}
