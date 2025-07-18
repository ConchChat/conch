// server.js (Node.js + Express + Socket.IO real-time chat server)

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.static('public'));

let messages = []; // In-memory storage for MVP

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send existing messages to newly connected user
  socket.emit('chat_history', messages);

  socket.on('send_message', (data) => {
    const messageData = {
      id: Date.now(),
      username: data.username,
      text: data.text,
    };
    messages.push(messageData);
    io.emit('receive_message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
