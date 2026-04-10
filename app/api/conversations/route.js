import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json(conversations);
  } catch (error) {
    console.error('GET /api/conversations failed:', error);

    return Response.json(
      {
        error: 'Failed to fetch conversations',
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const title = body?.title?.trim() || 'New Conversation';

    const conversation = await prisma.conversation.create({
      data: {
        title,
      },
    });

    return Response.json(conversation, { status: 201 });
  } catch (error) {
    console.error('POST /api/conversations failed:', error);

    return Response.json(
      {
        error: 'Failed to create conversation',
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}