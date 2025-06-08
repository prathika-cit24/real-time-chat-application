
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

let clientCount = 0;

io.on('connection', (socket) => {
  clientCount++;
  io.emit('clients total', clientCount);
  console.log(`New client connected: ${socket.id}`);

  let userName = 'anonymous';

  // Handle user join
  socket.on('user joined', (name) => {
    userName = name;
    socket.broadcast.emit('user joined', name);
  });

  // Handle incoming chat message
  socket.on('chat message', (data) => {
    io.emit('chat message', data);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    clientCount--;
    io.emit('clients total', clientCount);
    socket.broadcast.emit('user left', userName);
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
