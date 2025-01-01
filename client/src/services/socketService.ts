import io from 'socket.io-client';
import { API_URL } from '../config';

let socket = io(API_URL, {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

export const initializeSocket = (token: string) => {
  if (socket.disconnected) {
    socket.auth = { token };
    socket.connect();

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export { socket };