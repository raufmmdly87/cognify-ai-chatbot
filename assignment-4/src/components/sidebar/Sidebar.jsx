import ConversationList from './ConversationList';

function Sidebar({ conversations, activeConversationId, onSelectConversation }) {
  return (
    <aside className="w-72 shrink-0 border-r border-white/5 bg-gradient-to-b from-[#0E1630] to-[#0B1020] p-4">
      <button className="w-full rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#0A2A66] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1E3A8A]/20 hover:opacity-95 active:scale-[0.99] transition">
        + New Chat
      </button>

      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
      />

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-semibold text-slate-200">Status</p>
        <p className="mt-1 text-[11px] text-slate-400">Online • ready</p>
      </div>
    </aside>
  );
}

export default Sidebar;