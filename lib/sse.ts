// Helper for Server-Sent Events (SSE) using fetch + ReadableStream
export async function fetchSSE(url: string, options: RequestInit & { onMessage: (data: string) => void, onError?: (err: any) => void, signal?: AbortSignal }) {
  const { onMessage, onError, signal, ...fetchOpts } = options;
  try {
    const res = await fetch(url, { ...fetchOpts, signal });
    if (!res.body) throw new Error('No response body');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          onMessage(line.slice(6));
        }
      }
    }
  } catch (err) {
    onError?.(err);
  }
}
