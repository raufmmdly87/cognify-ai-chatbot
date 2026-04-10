'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Sidebar from '../../../components/sidebar/Sidebar';
import ChatPanel from '../../../components/chat/ChatPanel';

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data;
}

function ConversationPageClient({ conversationId }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const numericConversationId = Number(conversationId);

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const data = await fetchJson('/api/conversations');
      return Array.isArray(data) ? data : [];
    },
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', numericConversationId],
    queryFn: async () => {
      const data = await fetchJson(
        `/api/conversations/${numericConversationId}/messages`,
      );
      return Array.isArray(data) ? data : [];
    },
    enabled: Number.isFinite(numericConversationId),
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      return fetchJson('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });
    },
    onSuccess: async (newConversation) => {
      await queryClient.invalidateQueries({ queryKey: ['conversations'] });
      router.push(`/conversations/${newConversation.id}`);
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id) => {
      return fetchJson(`/api/conversations/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: async (_data, deletedId) => {
      await queryClient.invalidateQueries({ queryKey: ['conversations'] });
      await queryClient.removeQueries({ queryKey: ['messages', deletedId] });

      const remainingConversations = conversations.filter(
        (conversation) => conversation.id !== deletedId,
      );

      if (deletedId === numericConversationId) {
        if (remainingConversations.length > 0) {
          router.push(`/conversations/${remainingConversations[0].id}`);
        } else {
          const newConversation = await createConversationMutation.mutateAsync();
          router.push(`/conversations/${newConversation.id}`);
        }
      }
    },
  });


    const renameConversationMutation = useMutation({
    mutationFn: async ({ id, title }) => {
      return fetchJson(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text) => {
      const currentMessages =
        queryClient.getQueryData(['messages', numericConversationId]) || [];

      const safeCurrentMessages = Array.isArray(currentMessages)
        ? currentMessages.filter(
            (message) =>
              !(typeof message.id === 'string' && message.id.startsWith('temp-')),
          )
        : [];

      const userMessage = await fetchJson(
        `/api/conversations/${numericConversationId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'user',
            content: text,
          }),
        },
      );

      try {
        const chatData = await fetchJson('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...safeCurrentMessages, userMessage],
          }),
        });

        const assistantMessage = await fetchJson(
          `/api/conversations/${numericConversationId}/messages`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              role: 'assistant',
              content: chatData.content,
            }),
          },
        );

        return { userMessage, assistantMessage };
      } catch {
        const fallbackAssistantMessage = await fetchJson(
          `/api/conversations/${numericConversationId}/messages`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              role: 'assistant',
              content: 'Something went wrong while getting the AI reply.',
            }),
          },
        );

        return { userMessage, assistantMessage: fallbackAssistantMessage };
      }
    },

    onMutate: async (text) => {
      await queryClient.cancelQueries({
        queryKey: ['messages', numericConversationId],
      });

      const previousMessages =
        queryClient.getQueryData(['messages', numericConversationId]) || [];

      const optimisticUserMessage = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: text,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        ['messages', numericConversationId],
        Array.isArray(previousMessages)
          ? [...previousMessages, optimisticUserMessage]
          : [optimisticUserMessage],
      );

      return { previousMessages };
    },

    onError: (_error, _text, context) => {
      queryClient.setQueryData(
        ['messages', numericConversationId],
        context?.previousMessages || [],
      );
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['messages', numericConversationId],
      });
    },
  });

  const handleSelectConversation = (id) => {
    router.push(`/conversations/${id}`);
  };

  const handleCreateConversation = () => {
    createConversationMutation.mutate();
  };

  const handleDeleteConversation = (id) => {
    if (deleteConversationMutation.isPending) return;
    deleteConversationMutation.mutate(id);
  };

    const handleRenameConversation = (id, title) => {
    if (!title.trim()) return;
    renameConversationMutation.mutate({ id, title });
  };

  const handleSendMessage = (text) => {
    if (!text.trim() || !numericConversationId) return;
    sendMessageMutation.mutate(text);
  };

  return (
    <div className="flex h-screen bg-[#0B1020] text-slate-100">
          <Sidebar
        conversations={conversations}
        activeConversationId={numericConversationId}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleCreateConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        isCreatingConversation={createConversationMutation.isPending}
        isDeletingConversation={deleteConversationMutation.isPending}
        isRenamingConversation={renameConversationMutation.isPending}
      />

      <ChatPanel
        conversations={conversations}
        activeConversationId={numericConversationId}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoadingReply={sendMessageMutation.isPending}
      />
    </div>
  );
}

export default ConversationPageClient;