const messagesHistory = document.getElementById('messages-history');
const messagesList = document.getElementById('messages-list');

function scrollToBottom() {
  messagesHistory.scrollTop = messagesHistory.scrollHeight;
}

function createRow(align) {
  const row = document.createElement('div');
  row.className = `flex ${align} w-full`;
  return row;
}

function createBubble({ text, variant }) {
  const bubble = document.createElement('div');

  if (variant === 'user') {
    bubble.className =
      'max-w-[70%] rounded-2xl rounded-tr-md bg-gradient-to-r from-[#1E3A8A] to-[#0A2A66] px-4 py-3 text-[13px] leading-relaxed text-white shadow-lg shadow-[#1E3A8A]/20';
  } else {
    bubble.className =
      'max-w-[70%] rounded-2xl rounded-tl-md border border-white/10 bg-white/5 px-4 py-3 text-[13px] leading-relaxed text-slate-100 shadow-sm';
  }

  bubble.textContent = text;
  return bubble;
}

export function addUserMessage(text) {
  const row = createRow('justify-end');
  const bubble = createBubble({ text, variant: 'user' });
  row.appendChild(bubble);
  messagesList.appendChild(row);
  scrollToBottom();
}

export function createAssistantMessage() {
  const row = createRow('justify-start');
  const bubble = createBubble({ text: '', variant: 'assistant' });
  row.appendChild(bubble);
  messagesList.appendChild(row);
  scrollToBottom();
  return bubble;
}

export function appendToAssistantMessage(bubbleEl, deltaText) {
  bubbleEl.textContent += deltaText;
  scrollToBottom();
}
