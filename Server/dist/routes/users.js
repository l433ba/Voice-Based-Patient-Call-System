"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const types_1 = require("../types");
const userController_1 = require("../controllers/userController");
const validation_1 = require("../middleware/validation");
const validation_2 = require("../middleware/validation");
const router = express_1.default.Router();
router.use(auth_1.protect);
// Admin routes
router.get('/', (0, auth_1.authorize)([types_1.UserRole.ADMIN]), userController_1.getUsers);
router.get('/by-role', (0, auth_1.authorize)([types_1.UserRole.ADMIN]), validation_2.validateGetUsersByRole, userController_1.getUsersByRole);
router.get('/pending-nurses', (0, auth_1.authorize)([types_1.UserRole.ADMIN]), userController_1.getPendingNurses);
router.patch('/:id', (0, auth_1.authorize)([types_1.UserRole.ADMIN]), validation_1.validateUserUpdate, userController_1.updateUser);
router.patch('/:id/approve', (0, auth_1.authorize)([types_1.UserRole.ADMIN]), validation_1.validateApproval, userController_1.approveNurse);
// Nurse routes
router.post('/register-patient', (0, auth_1.authorize)([types_1.UserRole.NURSE]), validation_1.validatePatientRegistration, userController_1.registerPatient);
exports.default = router;
