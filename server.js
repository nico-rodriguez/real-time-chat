const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const { createMessage } = require('./utils/message');
const {
  joinUser,
  getUserById,
  userLeave,
  getRoomUsers,
} = require('./utils/user');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  // New user joins a room
  socket.on('room:join', ({ username, room }) => {
    joinUser(socket.id, username, room);
    socket.join(room);

    // Welcome message
    socket.emit('message', createMessage(`Welcome to ChatCord ${username}!`));

    // Broadcast when a user connects
    // Emit to all but this socket
    socket.broadcast
      .to(room)
      .emit('message', createMessage(`${username} has joined the chat`));

    // Send room information (id and users)
    io.to(room).emit('room:info', {
      room: room,
      users: getRoomUsers(room),
    });
  });

  // Listen for chat messages
  socket.on('chat:message', (message) => {
    const user = getUserById(socket.id);
    io.to(user.room).emit('message', createMessage(message, user.username));
  });

  // Client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      // Emit to all connected sockets in the user's room room
      io.to(user.room).emit(
        'message',
        createMessage(`${user.username} has left the chat`)
      );

      // Send room information (id and users)
      io.to(user.room).emit('room:info', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () => console.log(`Server listening on PORT ${PORT}!`));
