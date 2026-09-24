require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const { connectMongoDB } = require('./config/db');

const tasksRouter = require('./routes/tasks');
const membersRouter = require('./routes/members');
const projectsRouter = require('./routes/projects');
const docsRouter = require('./routes/docs');

const app = express();
const server = http.createServer(app);

// Strict Origin Validation (Protects against CSRF & Unauthorized Cross-Origin Exploitation)
const allowedOrigins = [
  'https://bscf-taskmanager.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

function isOriginAllowed(origin) {
  if (!origin) return true; // Allow non-browser requests, health checkers, server-side calls
  if (allowedOrigins.includes(origin)) return true;
  // Allow preview deployments generated under this project on Vercel
  if (/^https:\/\/bscf-taskmanager.*\.vercel\.app$/.test(origin)) return true;
  return false;
}

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Cross-Origin Request Blocked by BSCF Security Policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

// Enable Socket.io with strict CORS policy
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Cross-Origin WebSocket Blocked by BSCF Security Policy'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.set('io', io);

// Trust proxy for Render/Vercel reverse proxy headers (rate-limiting IP detection)
app.set('trust proxy', 1);

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' })); // Limit JSON payload size to prevent body flood DoS

// Rate Limiting on all /api routes (prevents spam and resource exhaustion)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // 600 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

app.use('/api/', apiLimiter);

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
      console.log(`📊 Socket.io Gateway: Ready with Strict Security Policies`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
