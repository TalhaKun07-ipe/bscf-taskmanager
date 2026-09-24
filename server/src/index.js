require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { connectMongoDB } = require('./config/db');

const tasksRouter = require('./routes/tasks');
const membersRouter = require('./routes/members');
const projectsRouter = require('./routes/projects');
const docsRouter = require('./routes/docs');

const app = express();
const server = http.createServer(app);

// Enable Socket.io with permissive CORS for local development
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/members', membersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/docs', docsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    system: 'TaskFlow Server',
    database: {
      type: 'MongoDB',
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host || 'local'
    },
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to live updates: ${socket.id}`);

  socket.on('join:board', (boardId) => {
    socket.join(`board:${boardId}`);
    console.log(`Client ${socket.id} joined board ${boardId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectMongoDB();

    // Check if initial organization seed is needed
    const Member = require('./models/Member');
    const memberCount = await Member.countDocuments();
    if (memberCount === 0) {
      console.log('⚡ Empty database detected. Setting up BSCF organization...');
      const seedData = require('./seed');
      await seedData();
    }

    server.listen(PORT, () => {
      console.log(`🚀 TaskFlow Backend API running at http://localhost:${PORT}`);
      console.log(`🍃 Unified MongoDB Database: Active (Tasks, Members, Projects, Docs)`);
      console.log(`📊 Socket.io Gateway: Ready`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
