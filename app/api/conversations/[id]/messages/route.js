let messagesDb = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    role: 'assistant',
    content: 'Welcome to the Image Processing chat.',
    timestamp: '12:00',
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    role: 'user',
    content: 'Can you explain edge detection?',
    timestamp: '12:01',
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    role: 'assistant',
    content: 'Edge detection highlights strong intensity changes in an image.',
    timestamp: '12:02',
  },
  {
    id: 'msg-4',
    conversationId: 'conv-2',
    role: 'assistant',
    content: 'Hey — send a message and I’ll reply.',
    timestamp: '12:04',
  },
  {
    id: 'msg-5',
    conversationId: 'conv-2',
    role: 'user',
    content: 'Perfect. I’m testing the chat now.',
    timestamp: '12:05',
  },
  {
    id: 'msg-6',
    conversationId: 'conv-2',
    role: 'assistant',
    content: 'Cool. Try a real question.',
    timestamp: '12:06',
  },
];

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function GET(request, { params }) {
  const { id } = await params;

  const filteredMessages = messagesDb.filter(
    (message) => message.conversationId === id,
  );

  return Response.json(filteredMessages);
}

export async function POST(request, { params }) {
  const { id } = await params;
  const messageData = await request.json();

  const newMessage = {
    id: `msg-${Date.now()}`,
    conversationId: id,
    role: messageData.role,
    content: messageData.content,
    timestamp: getCurrentTime(),
  };

  messagesDb.push(newMessage);

  return Response.json(newMessage);
}