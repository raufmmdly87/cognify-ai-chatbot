'use client';

import MessageItem from './MessageItem';

function MessageList({ messages = [] }) {
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <>
      {safeMessages.map((message) => (
        <MessageItem
          key={message.id}
          role={message.role}
          content={message.content}
          timestamp={message.createdAt || message.timestamp}
        />
      ))}
    </>
  );
}

export default MessageList;