"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const requestController_1 = require("../controllers/requestController");
const router = express_1.default.Router();
// Protected routes - all routes require authentication
router.use(auth_1.protect);
// Patient routes - temporarily remove validation
router.post('/', requestController_1.createRequest);
// Shared routes
router.get('/', requestController_1.getRequests);
// Nurse and admin routes
router.put('/:requestId/status', requestController_1.updateRequestStatus);
router.put('/:requestId/assign', requestController_1.assignRequest);
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
exports.default = router;
