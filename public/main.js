const socket = io();

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const clientsTotal = document.getElementById('clients-total');

let currentUserName = '';
let hasJoined = false;

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  const name = nameInput.value.trim() || 'anonymous';

  if (message) {
    if (!hasJoined && name !== 'anonymous') {
      socket.emit('user joined', name);
      hasJoined = true;
      currentUserName = name;
    }

    socket.emit('chat message', { name, message });
    messageInput.value = '';
  }
});

socket.on('chat message', (data) => {
  const messageElement = document.createElement('li');
  const isCurrentUser = data.name === currentUserName;
  messageElement.classList.add(isCurrentUser ? 'message-right' : 'message-left');
  messageElement.innerHTML = `<strong>${data.name}:</strong> ${data.message}`;
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

socket.on('clients total', (count) => {
  clientsTotal.textContent = `Total clients: ${count}`;
});

socket.on('user joined', (name) => {
  const notice = document.createElement('li');
  notice.classList.add('system-message');
  notice.textContent = `${name} joined the chat`;
  messageContainer.appendChild(notice);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

socket.on('user left', (name) => {
  const notice = document.createElement('li');
  notice.classList.add('system-message');
  notice.textContent = `${name} left the chat`;
  messageContainer.appendChild(notice);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});
