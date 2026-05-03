'use client';

import MessageList from './MessageList';
import MessageInput from './MessageInput';
import LoadingIndicator from './LoadingIndicator';

function ChatPanel({
  activeConversationTitle,
  messages,
  onSendMessage,
  isLoadingReply,
  errorMessage = '',
}) {
  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="border-b border-white/5 bg-white/5 px-6 py-4 backdrop-blur">
        <h1 className="text-sm font-semibold tracking-wide text-slate-100">
          {activeConversationTitle || 'Select a conversation'}
        </h1>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Quick notes and AI replies.
        </p>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto w-full max-w-2xl space-y-4 px-2">
          <MessageList messages={messages} />
          {isLoadingReply && <LoadingIndicator />}
          {errorMessage ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errorMessage}
            </div>
          ) : null}
        </div>
      </section>

      <MessageInput onSendMessage={onSendMessage} />
    </main>
  );
}

export default ChatPanel;