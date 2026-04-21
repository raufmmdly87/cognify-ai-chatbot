import SidebarClient from './SidebarClient';

export default async function SidebarServer({
  activeConversationId,
  initialConversations,
}) {
  return (
    <SidebarClient
      conversations={initialConversations}
      activeConversationId={activeConversationId}
    />
  );
}