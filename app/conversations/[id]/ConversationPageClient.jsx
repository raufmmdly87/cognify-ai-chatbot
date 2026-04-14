'use client';

import { useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import ChatPanel from '../../../components/chat/ChatPanel';
import { dbMessagesToUIMessages } from '@/lib/chat-conversion';

function ConversationPageClient({
  conversationId,
  initialMessages,
  activeConversationTitle,
}) {
  const uiMessages = useMemo(
    () => dbMessagesToUIMessages(initialMessages || []),
    [initialMessages],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: String(conversationId),
    transport: new DefaultChatTransport({
      api: '/api/chat/stream',
      prepareSendMessagesRequest({ messages, body }) {
        return {
          body: {
            messages,
            conversationId: body?.conversationId,
          },
        };
      },
    }),
    messages: uiMessages,
    onError(err) {
      console.error('useChat error:', err);
    },
  });

  const handleSendMessage = async (text) => {
    if (!text.trim() || Number.isNaN(Number(conversationId))) return;

    await sendMessage(
      { text },
      {
        body: { conversationId },
      },
    );
  };

  return (
    <ChatPanel
      activeConversationTitle={activeConversationTitle}
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoadingReply={status === 'submitted' || status === 'streaming'}
      errorMessage={error?.message || ''}
    />
  );
}

export default ConversationPageClient;