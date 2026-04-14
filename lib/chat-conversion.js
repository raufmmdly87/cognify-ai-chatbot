export function dbMessagesToUIMessages(messages = []) {
  return messages.map((message) => ({
    id: String(message.id),
    role: message.role,
    parts: [
      {
        type: 'text',
        text: message.content || '',
      },
    ],
    createdAt: message.createdAt,
  }));
}

export function getTextFromUIMessage(message) {
  if (!message) return '';

  if (typeof message.content === 'string') {
    return message.content;
  }

  return (
    message.parts
      ?.filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('') || ''
  );
}