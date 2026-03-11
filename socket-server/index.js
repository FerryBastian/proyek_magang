const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User terhubung:', socket.id);

  socket.on('disconnect', () => {
    console.log('User terputus:', socket.id);
  });
});

// Endpoint dipanggil Laravel saat status berubah
app.post('/emit-status', (req, res) => {
  const { user_id, submission_id, status, title } = req.body;

  if (!submission_id || !status) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  // Broadcast ke semua client (sesuai implementasi teman)
  io.emit('notifikasi', {
    id: submission_id,
    user_id,
    status,
    title,
  });

  console.log('Emit notifikasi:', { submission_id, status, title });

  return res.json({ message: 'Event dikirim' });
});

server.listen(3001, () => {
  console.log('Socket.IO server berjalan di port 3001');
});