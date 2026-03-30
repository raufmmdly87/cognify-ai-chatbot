function ConversationItem({ title, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl px-3 py-3 text-left text-sm transition ${
        isActive
          ? 'border border-white/15 bg-white/10 font-semibold text-slate-100 shadow-sm'
          : 'border border-white/10 bg-white/5 font-medium text-slate-100 hover:bg-white/10'
      }`}
    >
      {title}
    </button>
  );
}

export default ConversationItem;
