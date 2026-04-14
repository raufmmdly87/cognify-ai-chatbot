import { getConversations, getMessages } from '@/lib/data/chat';
import SidebarServer from '@/components/sidebar/SidebarServer';
import ConversationPageClient from './ConversationPageClient';

export default async function ConversationPage({ params }) {
  const { id } = await params;
  const conversationId = Number(id);

  const [conversations, messages] = await Promise.all([
    getConversations(),
    Number.isNaN(conversationId) ? Promise.resolve([]) : getMessages(conversationId),
  ]);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === conversationId,
  );

  return (
    <div className="flex h-screen bg-[#0B1020] text-slate-100">
      <SidebarServer activeConversationId={conversationId} />

      <ConversationPageClient
        conversationId={conversationId}
        initialMessages={messages}
        activeConversationTitle={activeConversation?.title || 'New Conversation'}
      />
    </div>
  );
}