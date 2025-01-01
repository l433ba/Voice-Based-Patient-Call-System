"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const nurseController_1 = require("../controllers/nurseController");
const router = express_1.default.Router();
// Protected routes
router.use(auth_1.protect);
// Admin routes
router.get('/', (0, auth_1.authorize)(['admin']), nurseController_1.getNurses);
router.put('/:id/approve', (0, auth_1.authorize)(['admin']), nurseController_1.approveNurse);
router.put('/:id/reject', (0, auth_1.authorize)(['admin']), nurseController_1.rejectNurse);
exports.default = router;
