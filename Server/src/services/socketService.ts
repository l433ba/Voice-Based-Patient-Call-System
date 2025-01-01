import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { Request } from '../models/Request';
import { Nurse } from '../models/Nurse';
import { Types } from 'mongoose';

interface SocketData {
  user: {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    role: 'patient' | 'nurse' | 'admin';
    nurseRole?: string;
  };
}

interface SocketWithData extends Socket {
  data: SocketData;
}

export class SocketService {
  private io: Server;
  private userSockets: Map<string, string> = new Map();

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(async (socket: Socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Authentication error');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
        const user = await User.findById(decoded._id).lean();
        
        if (!user) {
          throw new Error('User not found');
        }

        const userData = {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        };

        (socket as SocketWithData).data = { user: userData };
        this.userSockets.set(userData._id.toString(), socket.id);
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: SocketWithData) => {
      const userId = socket.data.user._id.toString();
      console.log('User connected:', userId);

      socket.join(`role:${socket.data.user.role}`);
      socket.join(`user:${userId}`);

      socket.on('disconnect', () => {
        console.log('User disconnected:', userId);
        this.userSockets.delete(userId);
      });

      // Handle request creation
      socket.on('create_request', async (requestData) => {
        try {
          const request = new Request({
            ...requestData,
            patient: new Types.ObjectId(userId),
          });
          await request.save();

          // Notify all nurses and admins
          this.io.to('role:nurse').to('role:admin').emit('new_request', {
            request,
            patient: socket.data.user,
          });
        } catch (error) {
          console.error('Error creating request:', error);
        }
      });

      // Handle request assignment
      socket.on('assign_request', async ({ requestId, nurseId }) => {
        try {
          const request = await Request.findByIdAndUpdate(
            requestId,
            {
              nurse: nurseId,
              status: 'assigned',
              responseTime: new Date(),
            },
            { new: true }
          );

          if (request) {
            const nurse = await Nurse.findById(nurseId).populate('user');
            
            // Notify assigned nurse
            this.io.to(`user:${nurseId}`).emit('request_assigned', {
              request,
              nurse: nurse?.user,
            });

            // Notify patient
            this.io.to(`user:${request.patient}`).emit('request_assigned', {
              request,
              nurse: nurse?.user,
            });
          }
        } catch (error) {
          console.error('Error assigning request:', error);
        }
      });

      // Handle request status updates
      socket.on('update_request_status', async ({ requestId, status, notes }) => {
        try {
          const request = await Request.findById(requestId);
          if (!request) return;

          const oldStatus = request.status;
          request.status = status;
          request.description = notes; // Using description instead of notes

          if (status === 'completed') {
            request.completedAt = new Date(); // Using completedAt instead of completionTime
          }

          await request.save();

          // Notify all relevant parties
          const notifyUsers = [request.patient];
          if (request.nurse) {
            notifyUsers.push(request.nurse);
          }

          notifyUsers.forEach(userId => {
            this.io.to(`user:${userId}`).emit('request_status_updated', {
              request,
              oldStatus,
              newStatus: status,
            });
          });
        } catch (error) {
          console.error('Error updating request status:', error);
        }
      });
    });
  }

  // Public methods to emit events
  public emitToUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  public emitToRole(role: string, event: string, data: any) {
    this.io.to(`role:${role}`).emit(event, data);
  }
} 