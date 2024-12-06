import { Server, Socket } from 'socket.io';
import { UserRole } from '../types';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Join room based on role and department
    socket.on('join', ({ role, department }) => {
      if (role === UserRole.NURSE || role === UserRole.ADMIN) {
        socket.join(`department:${department}`);
      }
    });

    // Handle new request
    socket.on('newRequest', (request) => {
      io.to(`department:${request.department}`).emit('requestUpdate', {
        type: 'new',
        request
      });
    });

    // Handle request status updates
    socket.on('updateRequest', (request) => {
      io.to(`department:${request.department}`).emit('requestUpdate', {
        type: 'update',
        request
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};