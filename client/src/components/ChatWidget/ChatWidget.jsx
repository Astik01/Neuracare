import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getBotReply } from './botReply';

const QUICK_REPLIES = ['I have a headache', 'I feel feverish', 'I have chest pain'];
const GREETING = { from: 'bot', text: 'Hi! Tell me your symptom and I can point you to the right specialist.' };

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');

  function send(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = getBotReply(trimmed);
    setMessages((current) => [
      ...current,
      { from: 'user', text: trimmed },
      { from: 'bot', text: reply.condition, suggestion: reply.suggestion },
    ]);
    setInput('');
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-80 rounded-lg border border-slate-200 bg-white shadow-xl flex flex-col max-h-96">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="font-semibold text-slate-900 text-sm">AI Assistant</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-sm">
            {messages.map((message, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={
                  message.from === 'user'
                    ? 'ml-auto max-w-[80%] rounded-lg bg-teal-700 px-3 py-2 text-white'
                    : 'mr-auto max-w-[85%] rounded-lg bg-slate-100 px-3 py-2 text-slate-800'
                }
              >
                <p className="font-medium">{message.text}</p>
                {message.suggestion && <p className="mt-1 text-xs">{message.suggestion}</p>}
                {message.suggestion && (
                  <Link to="/find-doctors" className="mt-1 inline-block text-xs font-medium underline">
                    Book a doctor →
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 px-4 py-2 border-t border-slate-100">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => send(reply)}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 hover:bg-slate-200"
              >
                {reply}
              </button>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-slate-200 p-2"
          >
            <label htmlFor="chat-input" className="sr-only">
              Ask a question
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask…"
              className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
            />
            <button type="submit" className="text-teal-700" aria-label="Send">
              ➤
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Minimize chat' : 'Open chat'}
        className="h-14 w-14 rounded-full bg-teal-700 text-white shadow-lg hover:bg-teal-800"
      >
        💬
      </button>
    </div>
  );
}
