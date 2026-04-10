'use client';
import ConversationItem from './ConversationItem';

function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  isDeletingConversation,
  isRenamingConversation,
}) {
  return (
    <div className="mt-5 space-y-2">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          title={conversation.title}
          isActive={conversation.id === activeConversationId}
          onClick={() => onSelectConversation(conversation.id)}
          onDelete={() => onDeleteConversation(conversation.id)}
          onRename={(newTitle) =>
            onRenameConversation(conversation.id, newTitle)
          }
          isDeleting={isDeletingConversation}
          isRenaming={isRenamingConversation}
        />
      ))}
    </div>
  );
}

export default ConversationList;