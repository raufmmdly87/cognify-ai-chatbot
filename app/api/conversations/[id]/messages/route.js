import { prisma } from '@/lib/prisma';

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const conversationId = Number(id);

    if (Number.isNaN(conversationId)) {
      return Response.json(
        { error: 'Invalid conversation id' },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return Response.json(messages);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request, context) {
  try {
    const { id } = await context.params;
    const conversationId = Number(id);
    const body = await request.json();
    const { role, content } = body;

    if (Number.isNaN(conversationId)) {
      return Response.json(
        { error: 'Invalid conversation id' },
        { status: 400 }
      );
    }

    if (!role || !content) {
      return Response.json(
        { error: 'Role and content are required' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        role,
        content,
        conversationId,
      },
    });

    return Response.json(message, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}