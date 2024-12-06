"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestController_1 = require("../controllers/requestController");
const auth_1 = require("../middleware/auth");
const auth_2 = require("../middleware/auth");
const router = express_1.default.Router();
// Patient routes
router.post('/', auth_1.auth, (0, auth_1.checkRole)(['patient']), requestController_1.createRequest);
// Shared routes (accessible by all roles)
router.get('/', auth_2.auth, requestController_1.getRequests);
// Admin and nurse routes
router.put('/:id/assign', auth_2.auth, (0, auth_1.checkRole)(['admin', 'nurse']), requestController_1.assignRequest);
router.put('/:id/status', auth_2.auth, (0, auth_1.checkRole)(['admin', 'nurse']), requestController_1.updateRequestStatus);
exports.default = router;
