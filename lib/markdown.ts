import React from 'react';

// Very basic Markdown renderer: supports code blocks, inline code, bold, italics, links, and line breaks
export function renderMarkdown(text: string): React.ReactNode {
  // Code blocks
  text = text.replace(/```([\s\S]*?)```/g, (_: string, code: string) => `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`);
  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Links
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  // Line breaks
  text = text.replace(/\n/g, '<br/>');
  return React.createElement('span', { dangerouslySetInnerHTML: { __html: text } });
}
