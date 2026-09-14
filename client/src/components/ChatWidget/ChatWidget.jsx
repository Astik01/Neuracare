import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBotReply } from './botReply';
import { useEscapeKey } from '../../hooks/useEscapeKey';

const QUICK_ACTIONS = [
  { label: 'Find a Doctor', to: '/find-doctors' },
  { label: 'Symptom Checker', to: '/symptom-checker' },
  { label: 'My Appointments', to: '/my-bookings' },
  { label: 'Health Library', to: '/health-library' },
  { label: 'Contact Support', to: '/contact' },
];

const QUICK_REPLIES = ['I have a headache', 'I feel feverish', 'I have chest pain'];
const GREETING = { from: 'bot', text: 'Hi! How can I help?' };

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const toggleButtonRef = useRef(null);

  function closeChat() {
    setIsOpen(false);
    toggleButtonRef.current?.focus();
  }

  useEscapeKey(isOpen, closeChat);

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

  function handleQuickAction(to) {
    setIsOpen(false);
    navigate(to);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 flex max-h-[75vh] w-[calc(100vw-2.5rem)] max-w-sm animate-fade-up flex-col rounded-2xl border border-slate-200 bg-white shadow-glow dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-brand-700 px-4 py-3 dark:border-slate-700">
            <div>
              <h2 className="font-display text-sm font-semibold text-white">Neuracare Assistant</h2>
              <p className="text-xs text-brand-100">Rule-based helper, not a real diagnosis</p>
            </div>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Close chat"
              className="flex-shrink-0 text-brand-100 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 text-sm">
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className={
                    message.from === 'user'
                      ? 'ml-auto max-w-[80%] rounded-2xl bg-brand-700 px-3 py-2 text-white'
                      : 'mr-auto max-w-[85%] rounded-2xl bg-slate-100 px-3 py-2 text-slate-800 dark:bg-slate-700 dark:text-slate-100'
                  }
                >
                  <p className="font-medium">{message.text}</p>
                  {message.suggestion && <p className="mt-1 text-xs">{message.suggestion}</p>}
                  {message.suggestion && (
                    <Link
                      to="/find-doctors"
                      onClick={() => setIsOpen(false)}
                      className="mt-1 inline-block text-xs font-medium underline"
                    >
                      Book a doctor →
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Quick actions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.to}
                  type="button"
                  onClick={() => handleQuickAction(action.to)}
                  className="rounded-full bg-brand-50 px-2.5 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300 dark:hover:bg-brand-900/50"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 border-t border-slate-100 px-4 py-2 dark:border-slate-700">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => send(reply)}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
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
            className="flex gap-2 border-t border-slate-200 p-2 dark:border-slate-700"
          >
            <label htmlFor="chat-input" className="sr-only">
              Ask a question
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask…"
              className="flex-1 rounded-full border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-brand-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            />
            <button type="submit" className="text-brand-700 dark:text-brand-400" aria-label="Send">
              ➤
            </button>
          </form>
        </div>
      )}
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Minimize chat' : 'Open chat'}
        className="h-14 w-14 rounded-full bg-brand-700 text-white shadow-glow transition hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        💬
      </button>
    </div>
  );
}
