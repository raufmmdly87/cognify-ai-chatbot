import { prisma } from '@/lib/prisma';

// Conversations
export async function getConversations() {
  return prisma.conversation.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createConversation(title = 'New Conversation') {
  return prisma.conversation.create({
    data: { title },
  });
}

export async function renameConversation(id, title) {
  return prisma.conversation.update({
    where: { id },
    data: { title },
  });
}

export async function deleteConversation(id) {
  return prisma.conversation.delete({
    where: { id },
  });
}

// Messages
export async function getMessages(conversationId) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createMessage({ conversationId, role, content }) {
  return prisma.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  });
}