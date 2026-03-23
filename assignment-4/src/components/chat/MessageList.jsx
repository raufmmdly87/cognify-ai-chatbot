import MessageItem from './MessageItem';

function MessageList({ messages }) {
  return (
    <>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          role={message.role}
          content={message.content}
          timestamp={message.timestamp}
        />
      ))}
    </>
  );
}

export default MessageList;