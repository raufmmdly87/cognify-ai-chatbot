'use client';

import MessageItem from './MessageItem';

function MessageList({ messages = [] }) {
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <>
      {safeMessages.map((message) => {
        const content =
          typeof message.content === 'string'
            ? message.content
            : message.parts
                ?.filter((part) => part.type === 'text')
                .map((part) => part.text)
                .join('') || '';

        const timestamp =
          message.createdAt || message.timestamp
            ? new Date(message.createdAt || message.timestamp).toLocaleString()
            : '';

        return (
          <MessageItem
            key={message.id}
            role={message.role}
            content={content}
            timestamp={timestamp}
          />
        );
      })}
    </>
  );
}

export default MessageList;