"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = void 0;
const types_1 = require("../types");
const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        // Join room based on role and department
        socket.on('join', ({ role, department }) => {
            if (role === types_1.UserRole.NURSE || role === types_1.UserRole.ADMIN) {
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
exports.setupSocketHandlers = setupSocketHandlers;
