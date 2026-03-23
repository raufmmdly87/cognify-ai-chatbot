import ConversationItem from './ConversationItem';

function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
}) {
  return (
    <div className="mt-5 space-y-2">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          title={conversation.title}
          isActive={conversation.id === activeConversationId}
          onClick={() => onSelectConversation(conversation.id)}
        />
      ))}
    </div>
  );
}

export default ConversationList;
