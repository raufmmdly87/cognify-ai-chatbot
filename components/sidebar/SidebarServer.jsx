import { getConversations } from '@/lib/data/chat';
import SidebarClient from './SidebarClient';

export default async function SidebarServer({ activeConversationId }) {
  const conversations = await getConversations();

  return (
    <SidebarClient
      conversations={conversations}
      activeConversationId={activeConversationId}
    />
  );
}