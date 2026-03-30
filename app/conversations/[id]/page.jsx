import ConversationPageClient from './ConversationPageClient';

export default async function ConversationPage({ params }) {
  const { id } = await params;
  return <ConversationPageClient conversationId={id} />;
}