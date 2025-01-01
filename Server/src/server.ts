import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';

// Routes
import authRoutes from './routes/auth';
import nurseRoutes from './routes/nurse';
import requestRoutes from './routes/request';
import testRoutes from './routes/test';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { SocketService } from './services/socketService';

// Verify environment variables are loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);

const app = express();
const httpServer = createServer(app);

// Initialize socket service
export const socketService = new SocketService(httpServer);

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/nurses', nurseRoutes);
app.use('/api/requests', requestRoutes);

// Add test routes in development
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/test', testRoutes);
}

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server - listen on all network interfaces
    const PORT = process.env.PORT || 5000;
    httpServer.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export { app };
