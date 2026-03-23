import {
  addUserMessage,
  createAssistantMessage,
  appendToAssistantMessage,
} from './chat.js';
import { streamAssistantReply } from './api.js';

const form = document.getElementById('messages-form');
const input = document.getElementById('messages-form-input');

const messages = [];

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userText = input.value.trim();
  if (!userText) return;

  input.value = '';

  addUserMessage(userText);
  messages.push({ role: 'user', content: userText });

  const assistantBubble = createAssistantMessage();

  try {
    const fullReply = await streamAssistantReply(messages, (delta) => {
      appendToAssistantMessage(assistantBubble, delta);
    });

    messages.push({ role: 'assistant', content: fullReply });
  } catch (err) {
    appendToAssistantMessage(
      assistantBubble,
      '\n\n(Error. Open console for details.)',
    );
    console.error(err);
  }
});
