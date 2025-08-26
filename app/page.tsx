"use client";
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatBubble from '../components/ChatBubble';
import ChatComposer from '../components/ChatComposer';
import TypingDots from '../components/TypingDots';
import { Message } from '../lib/types';
import { fetchSSE } from '../lib/sse';

const STORAGE_KEY = 'chat-history';

export default function Home() {
  const [persist, setPersist] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msgId, setMsgId] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Persistencia local opcional
  useEffect(() => {
    if (persist) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    }
  }, [persist]);
  useEffect(() => {
    if (persist) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, persist]);

  // Scroll al último mensaje
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setError(null);
    const userMsg: Message = {
      id: `msg-${msgId}-user`,
      role: 'user',
      content: input,
      createdAt: Date.now(),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setMsgId(id => id + 1);
    setInput('');
    setIsLoading(true);

    // POST /v1/chat para obtener conversationId
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
          conversationId,
        }),
      });
      if (!res.ok) {
        setError(res.status === 401 ? 'Token inválido' : 'Error al enviar mensaje');
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      setConversationId(data.conversationId || null);
      // Inicia stream SSE
      await handleStream(data.conversationId || null, [...messages, userMsg]);
    } catch (e: any) {
      setError('Error de red'), console.error(e);
      setIsLoading(false);
    }
  };

  const handleStream = async (cid: string | null, msgs: Message[]) => {
    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;
    let aiMsg: Message = {
      id: `msg-${msgId}-assistant`,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setMsgId(id => id + 1);
    try {
      await fetchSSE(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/chat/stream?cid=${cid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        signal: abortController.signal,
        onMessage: (chunk) => {
          aiMsg = { ...aiMsg, content: aiMsg.content + chunk };
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = aiMsg;
            return copy;
          });
        },
        onError: (err) => {
          setError('Error en el stream');
          setIsLoading(false);
        },
      });
      setIsLoading(false);
    } catch (e) {
      setError('Error en el stream');
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  const handleClearHistory = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <main className="flex h-screen">
      <Sidebar
        persist={persist}
        setPersist={setPersist}
        onNewConversation={handleNewConversation}
        onClearHistory={handleClearHistory}
        onSetToken={setToken}
      />
      <section className="flex-1 flex flex-col bg-blue-50">
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto px-2 sm:px-8 py-6"
          role="log"
          aria-live="polite"
          tabIndex={0}
        >
          {messages.length === 0 && (
            <div className="text-blue-400 text-center mt-16">¡Comienza una conversación!</div>
          )}
          {messages.map((msg, i) => (
            <ChatBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              isStreaming={isLoading && i === messages.length - 1 && msg.role === 'assistant'}
              onCopy={msg.content.match(/```[\s\S]*?```|`[^`]+`/) ? () => handleCopy(msg.content) : undefined}
            />
          ))}
          {isLoading && <TypingDots />}
        </div>
        <ChatComposer
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isLoading || !token}
        />
        {error && <div className="text-red-500 text-center py-2" role="alert">{error}</div>}
      </section>
    </main>
  );
}
