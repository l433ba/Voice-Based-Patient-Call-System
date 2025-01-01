"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const priorityService_1 = require("../services/priorityService");
const router = express_1.default.Router();
router.post('/ai-test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { disease } = req.body;
        if (!disease) {
            return res.status(400).json({
                success: false,
                message: 'Disease is required'
            });
        }
        console.log('Testing AI for disease:', disease);
        const startTime = Date.now();
        const [priority, description] = yield Promise.all([
            (0, priorityService_1.getPriority)(disease),
            (0, priorityService_1.generateDescription)(disease)
        ]);
        const endTime = Date.now();
        res.json({
            success: true,
            data: {
                disease,
                priority,
                description,
                processingTime: `${endTime - startTime}ms`
            }
        });
    }
    catch (error) {
        console.error('AI test error:', error);
        res.status(500).json({
            success: false,
            message: 'AI test failed',
            error: error.message
        });
    }
}));
exports.default = router;
