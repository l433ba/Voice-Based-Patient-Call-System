"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.socketService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
const auth_1 = __importDefault(require("./routes/auth"));
const nurse_1 = require("./routes/nurse");
const request_1 = __importDefault(require("./routes/request"));
const errorHandler_1 = require("./middleware/errorHandler");
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
    origin: '*',
    credentials: true,
}));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/nurses', nurse_1.nurseRoutes);
app.use('/api/requests', request_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
// Connect to MongoDB
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}
mongoose_1.default
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
