import { Server } from "socket.io";
import http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join room based on user role or workshop
  socket.on("join_workshop", (workshopId) => {
    socket.join(`workshop_${workshopId}`);
    console.log(`User ${socket.id} joined workshop_${workshopId}`);
  });

  socket.on("join_division", (divisionId) => {
    socket.join(`division_${divisionId}`);
    console.log(`User ${socket.id} joined division_${divisionId}`);
  });

  // Handle submission events
  socket.on("new_submission", (data) => {
    io.emit("submission_received", data);
    console.log("New submission:", data);
  });

  socket.on("submission_updated", (data) => {
    io.emit("submission_changed", data);
    console.log("Submission updated:", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
