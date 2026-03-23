function MessageItem({ role, content, timestamp }) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[70%]">
        <div
          className={
            isUser
              ? 'rounded-2xl rounded-tr-md bg-gradient-to-r from-[#1E3A8A] to-[#0A2A66] px-4 py-3 text-[13px] leading-relaxed text-white shadow-lg shadow-[#1E3A8A]/20'
              : 'rounded-2xl rounded-tl-md border border-white/10 bg-white/5 px-4 py-3 text-[13px] leading-relaxed text-slate-100 shadow-sm'
          }
        >
          {content}
        </div>

        <div
          className={`mt-1 text-[10px] text-slate-500 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
}

export default MessageItem;
