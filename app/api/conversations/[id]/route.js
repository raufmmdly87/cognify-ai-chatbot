import { prisma } from '@/lib/prisma';

export async function PATCH(request, context) {
  try {
    const { id } = await context.params;
    const conversationId = Number(id);
    const body = await request.json();
    const title = body?.title?.trim();

    if (Number.isNaN(conversationId)) {
      return Response.json(
        { error: 'Invalid conversation id' },
        { status: 400 }
      );
    }

    if (!title) {
      return Response.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: { title },
    });

    return Response.json(updatedConversation);
  } catch (error) {
    return Response.json(
      { error: 'Failed to rename conversation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const conversationId = Number(id);

    if (Number.isNaN(conversationId)) {
      return Response.json(
        { error: 'Invalid conversation id' },
        { status: 400 }
      );
    }

    await prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}