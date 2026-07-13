import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

// Load configuration files
import connectDB from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';
import apiLimiter from './middlewares/rateLimiter.js';
import apiRouter from './routes/index.js';
import ApiError from './utils/apiError.js';
import ApiResponse from './utils/apiResponse.js';

// Setup environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// ES Modules directory helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard Middlewares
app.use(helmet()); // Basic HTTP Header security
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Accept requests from all origins or configured origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression()); // Compress responses

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploaded files (Cloudinary local fallback storage)
// This will map http://localhost:5000/uploads/filename.jpg to server/public/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Apply rate limiter to all API endpoints
app.use('/api', apiLimiter);

// Base / Utility Endpoints (Registered directly on app for simplicity)

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  new ApiResponse(200, {
    uptime: process.uptime(),
    status: 'UP',
    timestamp: new Date()
  }, 'API server is running and healthy.').send(res);
});

// API Version Endpoint
app.get('/api/version', (req, res) => {
  new ApiResponse(200, {
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production'
  }, 'Portfolio API Service v1.0.0').send(res);
});

// Register Module Routing
app.use('/api', apiRouter);

// Fallback 404 handler for non-existent API routes
app.use('*', (req, res, next) => {
  next(new ApiError(404, `Endpoint ${req.originalUrl} not found on this server.`));
});

// Global Error Handler Middleware
app.use(errorHandler);

// Listen to Port
const server = app.listen(PORT, () => {
  console.log(`Server is executing in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});

// Graceful Shutdown handling for database and server connections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;
