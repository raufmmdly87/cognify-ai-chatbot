import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingIndicator from './LoadingIndicator';

function ChatPanel({
  conversations,
  activeConversationId,
  messages,
  onSendMessage,
  isLoadingReply,
}) {
  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="border-b border-white/5 bg-white/5 px-6 py-4 backdrop-blur">
        <h1 className="text-sm font-semibold tracking-wide text-slate-100">
          {activeConversation ? activeConversation.title : 'Select a conversation'}
        </h1>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Quick notes and AI replies.
        </p>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto w-full max-w-2xl space-y-4 px-2">
          <MessageList messages={messages} />
          {isLoadingReply && <LoadingIndicator />}
        </div>
      </section>

      <MessageInput onSendMessage={onSendMessage} />
    </main>
  );
}

export default ChatPanel;