"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const authController_1 = require("../controllers/authController");
const nurseController_1 = require("../controllers/nurseController");
const router = express_1.default.Router();
// Public routes
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password', authController_1.resetPassword);
// Protected routes
router.get('/profile', auth_1.auth, authController_1.getProfile);
router.put('/profile', auth_1.auth, authController_1.updateProfile);
// Role-specific routes
router.get('/nurses', auth_1.auth, (0, auth_1.checkRole)(['admin']), nurseController_1.getNurses);
router.put('/nurses/:id/approve', auth_1.auth, (0, auth_1.checkRole)(['admin']), nurseController_1.approveNurse);
router.put('/nurses/:id/reject', auth_1.auth, (0, auth_1.checkRole)(['admin']), nurseController_1.rejectNurse);
exports.default = router;
