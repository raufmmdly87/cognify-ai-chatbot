'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [items, setItems] = useState(conversations);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    setItems(conversations);
  }, [conversations]);

  const handleCreateConversation = async () => {
    if (isCreating) return;

    const previousItems = items;
    const optimisticConversation = {
      id: `temp-${Date.now()}`,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
    };

    setIsCreating(true);
    setItems([optimisticConversation, ...previousItems]);

    try {
      const newConversation = await fetchJson('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });

      router.push(`/conversations/${newConversation.id}`);
      router.refresh();
    } catch (error) {
      setItems(previousItems);
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteConversation = async (id) => {
    if (isDeleting || typeof id !== 'number') return;

    const previousItems = items;
    const nextItems = previousItems.filter((item) => item.id !== id);

    setIsDeleting(true);
    setItems(nextItems);

    try {
      await fetchJson(`/api/conversations/${id}`, {
        method: 'DELETE',
      });

      if (id === activeConversationId) {
        const fallbackConversation = nextItems[0];

        if (fallbackConversation && typeof fallbackConversation.id === 'number') {
          router.push(`/conversations/${fallbackConversation.id}`);
        }
      }

      router.refresh();
    } catch (error) {
      setItems(previousItems);
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRenameConversation = async (id, title) => {
    if (isRenaming || typeof id !== 'number' || !title.trim()) return;

    const previousItems = items;
    const nextItems = items.map((item) =>
      item.id === id ? { ...item, title: title.trim() } : item,
    );

    setIsRenaming(true);
    setItems(nextItems);

    try {
      await fetchJson(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });

      router.refresh();
    } catch (error) {
      setItems(previousItems);
      console.error(error);
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <aside className="w-72 shrink-0 border-r border-white/5 bg-gradient-to-b from-[#0E1630] to-[#0B1020] p-4">
      <button
        onClick={handleCreateConversation}
        disabled={isCreating}
        className="w-full rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#0A2A66] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1E3A8A]/20 transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCreating ? 'Creating...' : '+ New Chat'}
      </button>

      <ConversationList
        conversations={items}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          if (typeof id === 'number') {
            router.push(`/conversations/${id}`);
          }
        }}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        isDeletingConversation={isDeleting}
        isRenamingConversation={isRenaming}
      />

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-semibold text-slate-200">Status</p>
        <p className="mt-1 text-[11px] text-slate-400">Online • ready</p>
      </div>
    </aside>
  );
}

export default SidebarClient;