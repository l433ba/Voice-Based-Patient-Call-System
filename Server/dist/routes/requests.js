"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const requestController_1 = require("../controllers/requestController");
const router = express_1.default.Router();
router.use(auth_1.protect);
// Patient routes
router.post('/', (0, auth_1.authorize)(['patient']), requestController_1.createRequest);
// Shared routes
router.get('/', requestController_1.getRequests);
// Admin and nurse routes
router.put('/:id/assign', (0, auth_1.authorize)(['admin', 'nurse']), requestController_1.assignRequest);
router.put('/:id/status', (0, auth_1.authorize)(['admin', 'nurse']), requestController_1.updateRequestStatus);
exports.default = router;
