import type { Metadata } from 'next';
import '../src/app/globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'ChatGPT UI',
  description: 'Chat UI with Next.js 14, TypeScript, Tailwind',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-blue-50 text-blue-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
