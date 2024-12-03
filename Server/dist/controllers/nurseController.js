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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignedPatients = exports.rejectNurse = exports.approveNurse = exports.getNurses = void 0;
const Nurse_1 = require("../models/Nurse");
const AppError_1 = require("../utils/AppError");
const getNurses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nurses = yield Nurse_1.Nurse.find()
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: nurses,
        });
    }
    catch (error) {
        console.error('Get nurses error:', error);
        throw new AppError_1.AppError('Error fetching nurses', 500);
    }
});
exports.getNurses = getNurses;
const approveNurse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nurse = yield Nurse_1.Nurse.findById(req.params.id);
        if (!nurse) {
            throw new AppError_1.AppError('Nurse not found', 404);
        }
        nurse.isApproved = true;
        yield nurse.save();
        res.json({
            success: true,
            data: nurse,
            message: 'Nurse approved successfully',
        });
    }
    catch (error) {
        console.error('Approve nurse error:', error);
        throw new AppError_1.AppError('Error approving nurse', 500);
    }
});
exports.approveNurse = approveNurse;
const rejectNurse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nurse = yield Nurse_1.Nurse.findById(req.params.id);
        if (!nurse) {
            throw new AppError_1.AppError('Nurse not found', 404);
        }
        nurse.isApproved = false;
        yield nurse.save();
        res.json({
            success: true,
            data: nurse,
            message: 'Nurse rejected successfully',
        });
    }
    catch (error) {
        console.error('Reject nurse error:', error);
        throw new AppError_1.AppError('Error rejecting nurse', 500);
    }
});
exports.rejectNurse = rejectNurse;
const getAssignedPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new AppError_1.AppError('Authentication required', 401);
        }
        const nurse = yield Nurse_1.Nurse.findOne({ user: req.user._id })
            .populate({
            path: 'assignedPatients',
            populate: {
                path: 'user',
                select: 'fullName',
            },
        });
        if (!nurse) {
            throw new AppError_1.AppError('Nurse not found', 404);
        }
        res.json({
            success: true,
            data: nurse.assignedPatients,
        });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
});
exports.getAssignedPatients = getAssignedPatients;
