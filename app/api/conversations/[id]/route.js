import {
  deleteConversation,
  renameConversation,
} from '@/lib/data/chat';

export async function PATCH(request, context) {
  try {
    const { id } = await context.params;
    const conversationId = Number(id);
    const body = await request.json();
    const title = body?.title?.trim();

    if (Number.isNaN(conversationId) || !title) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const updatedConversation = await renameConversation(conversationId, title);
    return Response.json(updatedConversation);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to rename conversation' },
      { status: 500 },
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const conversationId = Number(id);

    if (Number.isNaN(conversationId)) {
      return Response.json({ error: 'Invalid conversation id' }, { status: 400 });
    }

    await deleteConversation(conversationId);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to delete conversation' },
      { status: 500 },
    );
  }
}