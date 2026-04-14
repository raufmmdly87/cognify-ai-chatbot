import { createConversation, getConversations } from '@/lib/data/chat';

export async function GET() {
  try {
    const conversations = await getConversations();
    return Response.json(conversations);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch conversations' },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const title = body?.title?.trim() || 'New Conversation';

    const conversation = await createConversation(title);
    return Response.json(conversation, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create conversation' },
      { status: 500 },
    );
  }
}