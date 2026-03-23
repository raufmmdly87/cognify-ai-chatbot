import { useState } from 'react';

function MessageInput({ onSendMessage }) {
  const [text, setText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!text.trim()) return;

    onSendMessage(text);
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/5 bg-white/5 px-6 py-4 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-2xl items-end gap-3">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="min-h-[44px] max-h-32 w-full resize-none rounded-2xl border border-white/10 bg-[#0B1020]/60 px-4 py-3 text-[13px] text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/20"
          placeholder="Type your message here..."
        />

        <button
          type="submit"
          className="shrink-0 rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#0A2A66] px-5 py-3 text-[13px] font-semibold text-white shadow-lg shadow-[#1E3A8A]/20 hover:opacity-95 active:scale-[0.99] transition"
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
