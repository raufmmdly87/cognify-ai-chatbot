import { useEffect, useState } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import ChatPanel from './components/chat/ChatPanel';
import { getConversations } from './api/conversationsApi';
import { getMessagesByConversationId, createMessage } from './api/messagesApi';
import { getAssistantReply } from './api/llmApi';

function App() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingReply, setIsLoadingReply] = useState(false);

  useEffect(() => {
    getConversations().then((data) => {
      setConversations(data);

      if (data.length > 0) {
        setActiveConversationId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!activeConversationId) return;

    getMessagesByConversationId(activeConversationId).then((data) => {
      setMessages(data);
    });
  }, [activeConversationId]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || !activeConversationId) return;

    const userMessage = await createMessage(activeConversationId, {
      role: 'user',
      content: text,
    });

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    setIsLoadingReply(true);

    try {
      const assistantText = await getAssistantReply(updatedMessages);

      const assistantMessage = await createMessage(activeConversationId, {
        role: 'assistant',
        content: assistantText,
      });

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = await createMessage(activeConversationId, {
        role: 'assistant',
        content: 'Something went wrong while getting the AI reply.',
      });

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
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
      />

      <ChatPanel
        conversations={conversations}
        activeConversationId={activeConversationId}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoadingReply={isLoadingReply}
      />
    </div>
  );
}

export default App;