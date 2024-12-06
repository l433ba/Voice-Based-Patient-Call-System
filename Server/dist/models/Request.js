"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const requestSchema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    nurse: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Nurse',
    },
    type: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'completed', 'cancelled'],
        default: 'pending',
    },
    description: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
    bedNumber: {
        type: String,
        required: true,
    },
    responseTime: {
        type: Date,
    },
    completionTime: {
        type: Date,
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});
// Add index for better query performance
requestSchema.index({ status: 1, priority: 1, createdAt: -1 });
requestSchema.index({ patient: 1, status: 1 });
requestSchema.index({ nurse: 1, status: 1 });
exports.Request = mongoose_1.default.model('Request', requestSchema);
