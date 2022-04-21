const chatForm = document.getElementById('chat-form');
const chatMessagesEl = document.querySelector('.chat-messages');
const roomNameEl = document.getElementById('room-name');
const usersListEl = document.getElementById('users');

// Get username and room from URL query parameters
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chat room
socket.emit('room:join', { username, room });

// Get room information (id and users)
socket.on('room:info', ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

// Message from server
socket.on('message', (message) => {
  outPutMessage(message);

  // Scroll to the bottom to see the last message
  chatMessagesEl.scrollTop =
    chatMessagesEl.scrollHeight - chatMessagesEl.clientHeight;
});

// Message submit
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const msg = event.target.elements.msg.value;
  // Emit a message to the server
  // The client waits for its own message from the server before displaying it in the `message` event
  socket.emit('chat:message', msg);

  // Clear message input
  event.target.elements.msg.value = '';
  event.target.elements.msg.focus();
});

// Display message to the DOM
function outPutMessage({ text, username, time }) {
  const messageEl = document.createElement('div');
  messageEl.classList.add('message');

  const messageMetadataEl = document.createElement('p');
  messageMetadataEl.classList.add('meta');
  messageMetadataEl.textContent = `${username} `;
  const messageTimeEl = document.createElement('span');
  messageTimeEl.textContent = time;
  messageMetadataEl.appendChild(messageTimeEl);

  messageEl.appendChild(messageMetadataEl);

  const messageTextEl = document.createElement('p');
  messageTextEl.classList.add('text');
  messageTextEl.textContent = text;

  messageEl.appendChild(messageTextEl);

  chatMessagesEl.appendChild(messageEl);
}

// Display room name to the DOM
function outputRoomName(room) {
  roomNameEl.textContent = room;
}

// Display users to the DOM
function outputRoomUsers(users) {
  // Clear users list
  usersListEl.replaceChildren();

  // Display current users in the room
  users.forEach(({ username }) => {
    const userEl = document.createElement('li');
    userEl.textContent = username;

    usersListEl.appendChild(userEl);
  });
}
