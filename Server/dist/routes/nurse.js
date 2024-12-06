"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nurseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const nurseController_1 = require("../controllers/nurseController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.nurseRoutes = router;
// Protected routes
router.use(auth_1.protect);
// Admin routes
router.get('/', (0, auth_1.authorize)(['admin']), nurseController_1.getNurses);
router.put('/:id/approve', (0, auth_1.authorize)(['admin']), nurseController_1.approveNurse);
router.put('/:id/reject', (0, auth_1.authorize)(['admin']), nurseController_1.rejectNurse);
// Nurse routes
router.get('/assigned-patients', (0, auth_1.authorize)(['nurse']), nurseController_1.getAssignedPatients);
