const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // nanti diganti URL frontend kamu
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User terhubung:', socket.id);

  // Dengarkan event dari Laravel
  socket.on('notifikasi', (data) => {
    console.log('Notifikasi masuk:', data);
    // Kirim ke semua client yang terhubung
    io.emit('notifikasi', data);
  });

  socket.on('disconnect', () => {
    console.log('User terputus:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Socket.IO server berjalan di port 3001');
});