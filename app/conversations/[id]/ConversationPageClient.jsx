'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/sidebar/Sidebar';
import ChatPanel from '../../../components/chat/ChatPanel';

function ConversationPageClient({ conversationId }) {
  const router = useRouter();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoadingReply, setIsLoadingReply] = useState(false);

  useEffect(() => {
    const loadConversations = async () => {
      const response = await fetch('/api/conversations');
      const data = await response.json();
      setConversations(data);
    };

    loadConversations();
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      const data = await response.json();
      setMessages(data);
    };

    loadMessages();
  }, [conversationId]);

  const handleSelectConversation = (id) => {
    router.push(`/conversations/${id}`);
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !conversationId) return;

    const userResponse = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'user',
        content: text,
      }),
    });

    const userMessage = await userResponse.json();
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoadingReply(true);

    try {
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!chatResponse.ok) {
        const errorData = await chatResponse.json();
        throw new Error(errorData.error || 'Failed to get assistant reply');
      }

      const chatData = await chatResponse.json();
      const assistantText = chatData.content;

      const assistantResponse = await fetch(
        `/api/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'assistant',
            content: assistantText,
          }),
        },
      );

      const assistantMessage = await assistantResponse.json();
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorResponse = await fetch(
        `/api/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'assistant',
            content: 'Something went wrong while getting the AI reply.',
          }),
        },
      );

      const errorMessage = await errorResponse.json();
      setMessages((prev) => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setIsLoadingReply(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0B1020] text-slate-100">
      <Sidebar
        conversations={conversations}
        activeConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
      />

      <ChatPanel
        conversations={conversations}
        activeConversationId={conversationId}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoadingReply={isLoadingReply}
      />
    </div>
  );
}

export default ConversationPageClient;