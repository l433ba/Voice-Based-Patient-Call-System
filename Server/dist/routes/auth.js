"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.post('/register-patient', validation_1.validatePatientRegistration, authController_1.registerPatient);
router.post('/register-nurse', authController_1.registerNurse);
router.post('/login', authController_1.login);
exports.default = router;
