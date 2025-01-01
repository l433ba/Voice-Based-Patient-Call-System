"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const patientController_1 = require("../controllers/patientController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Protected routes
router.use(auth_1.protect);
// Nurse routes
router.post('/register', (0, auth_1.authorize)(['nurse']), validation_1.validatePatientRegistration, patientController_1.registerPatient);
// Shared routes (nurse and admin)
router.get('/', (0, auth_1.authorize)(['nurse', 'admin']), patientController_1.getPatients);
router.get('/:id', (0, auth_1.authorize)(['nurse', 'admin']), patientController_1.getPatientById);
exports.default = router;
