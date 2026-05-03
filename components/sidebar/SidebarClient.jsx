'use client';

import { useRouter } from 'next/navigation';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import ConversationList from './ConversationList';

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

function SidebarClient({ conversations, activeConversationId }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => conversations,
    initialData: conversations,
    staleTime: Infinity,
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      return fetchJson('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['conversations'] });

      const previousConversations =
        queryClient.getQueryData(['conversations']) || [];

      const optimisticConversation = {
        id: `temp-${Date.now()}`,
        title: 'New Conversation',
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(['conversations'], [
        optimisticConversation,
        ...previousConversations,
      ]);

      return { previousConversations };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        ['conversations'],
        context?.previousConversations || [],
      );
    },
    onSuccess: (newConversation) => {
      queryClient.setQueryData(['conversations'], (old = []) => {
        const withoutTemp = old.filter(
          (conversation) =>
            !(
              typeof conversation.id === 'string' &&
              conversation.id.startsWith('temp-')
            ),
        );

        return [newConversation, ...withoutTemp];
      });

      router.push(`/conversations/${newConversation.id}`);
      router.refresh();
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id) => {
      return fetchJson(`/api/conversations/${id}`, {
        method: 'DELETE',
      });
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['conversations'] });

      const previousConversations =
        queryClient.getQueryData(['conversations']) || [];

      const nextConversations = previousConversations.filter(
        (conversation) => conversation.id !== id,
      );

      queryClient.setQueryData(['conversations'], nextConversations);

      return { previousConversations, nextConversations };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        ['conversations'],
        context?.previousConversations || [],
      );
    },
    onSuccess: (_data, deletedId, context) => {
      if (deletedId === activeConversationId) {
        const fallbackConversation = context?.nextConversations?.[0];

        if (
          fallbackConversation &&
          typeof fallbackConversation.id === 'number'
        ) {
          router.push(`/conversations/${fallbackConversation.id}`);
        }
      }

      router.refresh();
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
    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries({ queryKey: ['conversations'] });

      const previousConversations =
        queryClient.getQueryData(['conversations']) || [];

      const nextConversations = previousConversations.map((conversation) =>
        conversation.id === id
          ? { ...conversation, title: title.trim() }
          : conversation,
      );

      queryClient.setQueryData(['conversations'], nextConversations);

      return { previousConversations };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        ['conversations'],
        context?.previousConversations || [],
      );
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <aside className="w-72 shrink-0 border-r border-white/5 bg-gradient-to-b from-[#0E1630] to-[#0B1020] p-4">
      <button
        onClick={() => createConversationMutation.mutate()}
        disabled={createConversationMutation.isPending}
        className="w-full rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#0A2A66] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1E3A8A]/20 transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {createConversationMutation.isPending ? 'Creating...' : '+ New Chat'}
      </button>

      <ConversationList
        conversations={items}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          if (typeof id === 'number') {
            router.push(`/conversations/${id}`);
          }
        }}
        onDeleteConversation={(id) => {
          if (typeof id === 'number') {
            deleteConversationMutation.mutate(id);
          }
        }}
        onRenameConversation={(id, title) => {
          if (typeof id === 'number' && title.trim()) {
            renameConversationMutation.mutate({ id, title });
          }
        }}
        isDeletingConversation={deleteConversationMutation.isPending}
        isRenamingConversation={renameConversationMutation.isPending}
      />

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-semibold text-slate-200">Status</p>
        <p className="mt-1 text-[11px] text-slate-400">Online • ready</p>
      </div>
    </aside>
  );
}

export default SidebarClient;