"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.socketService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const nurse_1 = __importDefault(require("./routes/nurse"));
const request_1 = __importDefault(require("./routes/request"));
const test_1 = __importDefault(require("./routes/test"));
const socketService_1 = require("./services/socketService");
// Verify environment variables are loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app);
// Initialize socket service
exports.socketService = new socketService_1.SocketService(httpServer);
// Middleware
app.use((0, cors_1.default)({
    origin: ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/nurses', nurse_1.default);
app.use('/api/requests', request_1.default);
// Add test routes in development
if (process.env.NODE_ENV !== 'production') {
    app.use('/api/test', test_1.default);
}
// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json(Object.assign({ success: false, message: err.message || 'Internal server error' }, (process.env.NODE_ENV === 'development' && { stack: err.stack })));
});
// Connect to MongoDB
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}
mongoose_1.default
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
