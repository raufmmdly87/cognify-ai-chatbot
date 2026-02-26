const form = document.getElementById('composer');
const input = document.getElementById('messageInput');
const messages = document.getElementById('messages');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  displayMessage(userMessage, 'me');
  input.value = '';

  const reply = getReply(userMessage);
  displayMessage(reply, 'other');

  messages.scrollTop = messages.scrollHeight;
});

function displayMessage(message, sender) {
  const messageDiv = document.createElement('div');

  messageDiv.classList.add('message');
  messageDiv.classList.add(sender === 'me' ? 'messageMe' : 'messageOther');

  const p = document.createElement('p');
  p.textContent = message;
  messageDiv.appendChild(p);

  messages.appendChild(messageDiv);
}

function getReply(userMessage) {
  return 'Thanks — message received.';
}