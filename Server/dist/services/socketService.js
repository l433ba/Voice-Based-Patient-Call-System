"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Request_1 = require("../models/Request");
const Nurse_1 = require("../models/Nurse");
const mongoose_1 = require("mongoose");
class SocketService {
    constructor(server) {
        this.userSockets = new Map();
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || 'http://localhost:3000',
                methods: ['GET', 'POST'],
            },
        });
        this.setupMiddleware();
        this.setupEventHandlers();
    }
    setupMiddleware() {
        this.io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    throw new Error('Authentication error');
                }
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                const user = yield User_1.User.findById(decoded._id).lean();
                if (!user) {
                    throw new Error('User not found');
                }
                const userData = {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                };
                socket.data = { user: userData };
                this.userSockets.set(userData._id.toString(), socket.id);
                next();
            }
            catch (error) {
                next(new Error('Authentication error'));
            }
        }));
    }
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            const userId = socket.data.user._id.toString();
            console.log('User connected:', userId);
            socket.join(`role:${socket.data.user.role}`);
            socket.join(`user:${userId}`);
            socket.on('disconnect', () => {
                console.log('User disconnected:', userId);
                this.userSockets.delete(userId);
            });
            // Handle request creation
            socket.on('create_request', (requestData) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const request = new Request_1.Request(Object.assign(Object.assign({}, requestData), { patient: new mongoose_1.Types.ObjectId(userId) }));
                    yield request.save();
                    // Notify all nurses and admins
                    this.io.to('role:nurse').to('role:admin').emit('new_request', {
                        request,
                        patient: socket.data.user,
                    });
                }
                catch (error) {
                    console.error('Error creating request:', error);
                }
            }));
            // Handle request assignment
            socket.on('assign_request', (_a) => __awaiter(this, [_a], void 0, function* ({ requestId, nurseId }) {
                try {
                    const request = yield Request_1.Request.findByIdAndUpdate(requestId, {
                        nurse: nurseId,
                        status: 'assigned',
                        responseTime: new Date(),
                    }, { new: true });
                    if (request) {
                        const nurse = yield Nurse_1.Nurse.findById(nurseId).populate('user');
                        // Notify assigned nurse
                        this.io.to(`user:${nurseId}`).emit('request_assigned', {
                            request,
                            nurse: nurse === null || nurse === void 0 ? void 0 : nurse.user,
                        });
                        // Notify patient
                        this.io.to(`user:${request.patient}`).emit('request_assigned', {
                            request,
                            nurse: nurse === null || nurse === void 0 ? void 0 : nurse.user,
                        });
                    }
                }
                catch (error) {
                    console.error('Error assigning request:', error);
                }
            }));
            // Handle request status updates
            socket.on('update_request_status', (_a) => __awaiter(this, [_a], void 0, function* ({ requestId, status, notes }) {
                try {
                    const request = yield Request_1.Request.findById(requestId);
                    if (!request)
                        return;
                    const oldStatus = request.status;
                    request.status = status;
                    request.description = notes; // Using description instead of notes
                    if (status === 'completed') {
                        request.completedAt = new Date(); // Using completedAt instead of completionTime
                    }
                    yield request.save();
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
                }
                catch (error) {
                    console.error('Error updating request status:', error);
                }
            }));
        });
    }
    // Public methods to emit events
    emitToUser(userId, event, data) {
        const socketId = this.userSockets.get(userId);
        if (socketId) {
            this.io.to(socketId).emit(event, data);
        }
    }
    emitToRole(role, event, data) {
        this.io.to(`role:${role}`).emit(event, data);
    }
}
exports.SocketService = SocketService;
