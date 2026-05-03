import { createMessage, getMessages } from '@/lib/data/chat';

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const conversationId = Number(id);

    if (Number.isNaN(conversationId)) {
      return Response.json({ error: 'Invalid conversation id' }, { status: 400 });
    }

    const messages = await getMessages(conversationId);
    return Response.json(messages);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch messages' },
      { status: 500 },
    );
  }
}

export async function POST(request, context) {
  try {
    const { id } = await context.params;
    const conversationId = Number(id);
    const body = await request.json();
    const { role, content } = body;

    if (Number.isNaN(conversationId) || !role || !content) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const message = await createMessage({
      conversationId,
      role,
      content,
    });

    return Response.json(message, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to save message' },
      { status: 500 },
    );
  }
}