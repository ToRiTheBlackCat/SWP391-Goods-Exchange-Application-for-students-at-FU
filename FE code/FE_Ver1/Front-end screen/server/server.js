const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('chat', (chat) => {
    console.log('Received chat:', chat); // Log tin nhắn nhận được để kiểm tra
    io.emit('chat', chat); // Phát lại tin nhắn tới tất cả các client
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => console.log(`Server running on port 4000`));
