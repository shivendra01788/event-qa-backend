import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Initialize Socket.io and allow connections from anywhere (for now)
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // When an attendee submits a question
  socket.on('submit_question', (data) => {
    console.log('📥 New question received:', data);
    
    const question = {
      ...data,
      id: Date.now().toString(),
      status: 'pending',
      timestamp: new Date()
    };
    
    // Broadcast it to the admin dashboard
    io.emit('new_pending_question', question);
  });

  // When an admin approves a question
  socket.on('approve_question', (questionId) => {
    console.log('✅ Question approved:', questionId);
    io.emit('question_approved', questionId);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});