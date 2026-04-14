import { streamText } from 'ai';
import { openrouter } from '@/lib/ai';
import { createMessage } from '@/lib/data/chat';
import { getTextFromUIMessage } from '@/lib/chat-conversion';

function toModelMessages(messages = []) {
  return messages
    .map((message) => {
      const text = getTextFromUIMessage(message).trim();

      if (!text) return null;

      return {
        role: message.role,
        content: text,
      };
    })
    .filter(Boolean);
}

export async function POST(req) {
  try {
    const { messages, conversationId } = await req.json();
    const numericConversationId = Number(conversationId);

    if (Number.isNaN(numericConversationId)) {
      return Response.json(
        { error: 'Invalid conversation id' },
        { status: 400 },
      );
    }

    const lastUserMessage = messages[messages.length - 1];
    const userText = getTextFromUIMessage(lastUserMessage);

    if (!userText.trim()) {
      return Response.json(
        { error: 'User message is required' },
        { status: 400 },
      );
    }

    await createMessage({
      conversationId: numericConversationId,
      role: 'user',
      content: userText,
    });

    const result = streamText({
      model: openrouter.chatModel('nvidia/nemotron-3-super-120b-a12b:free'),
      messages: toModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: async ({ messages: finishedMessages }) => {
        const assistantMessage = finishedMessages[finishedMessages.length - 1];
        const assistantText = getTextFromUIMessage(assistantMessage);

        if (assistantText.trim()) {
          await createMessage({
            conversationId: numericConversationId,
            role: 'assistant',
            content: assistantText,
          });
        }
      },
    });
  } catch (error) {
    console.error('POST /api/chat/stream failed:', error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Streaming failed',
      },
      { status: 500 },
    );
  }
}