import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';

// Routes
import authRoutes from './routes/auth';
import nurseRoutes from './routes/nurse';
import requestRoutes from './routes/request';

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
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/nurses', nurseRoutes);
app.use('/api/requests', requestRoutes);

// Error handling
app.use(errorHandler);

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export { app };
