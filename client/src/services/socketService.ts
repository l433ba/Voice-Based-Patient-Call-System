import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKET_URL } from '@/config';
import { RequestResponse } from '@/types/api';

export class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  async connect() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Socket connection error:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Event listeners for requests
  onNewRequest(callback: (data: { request: RequestResponse; patient: any }) => void) {
    if (!this.socket) return;
    this.socket.on('new_request', callback);
  }

  onRequestAssigned(callback: (data: { request: RequestResponse; nurse: any }) => void) {
    if (!this.socket) return;
    this.socket.on('request_assigned', callback);
  }

  onRequestStatusUpdated(
    callback: (data: { 
      request: RequestResponse; 
      oldStatus: string; 
      newStatus: string 
    }) => void
  ) {
    if (!this.socket) return;
    this.socket.on('request_status_updated', callback);
  }

  onNurseRegistered(callback: () => void) {
    if (!this.socket) return;
    this.socket.on('nurse_registered', callback);
  }

  // Remove event listeners
  removeListener(event: string) {
    if (!this.socket) return;
    this.socket.off(event);
  }
}

export const socketService = SocketService.getInstance(); 