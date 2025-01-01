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
const getNurses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nurses = yield Nurse_1.Nurse.find()
            .select('-password')
            .lean();
        res.json({
            success: true,
            data: nurses
        });
    }
    catch (error) {
        console.error('Error fetching nurses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch nurses'
        });
    }
});
exports.getNurses = getNurses;
const approveNurse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nurse = yield Nurse_1.Nurse.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true }).select('-password');
        if (!nurse) {
            return res.status(404).json({
                success: false,
                message: 'Nurse not found'
            });
        }
        res.json({
            success: true,
            data: nurse
        });
    }
    catch (error) {
        console.error('Error approving nurse:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve nurse'
        });
    }
});
exports.approveNurse = approveNurse;
const rejectNurse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nurse = yield Nurse_1.Nurse.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true }).select('-password');
        if (!nurse) {
            return res.status(404).json({
                success: false,
                message: 'Nurse not found'
            });
        }
        res.json({
            success: true,
            data: nurse
        });
    }
    catch (error) {
        console.error('Error rejecting nurse:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject nurse'
        });
    }
});
exports.rejectNurse = rejectNurse;
const getAssignedPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const nurse = yield Nurse_1.Nurse.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id })
            .populate({
            path: 'assignedPatients',
            populate: {
                path: 'user',
                select: 'firstName lastName fullName email'
            }
        });
        if (!nurse) {
            return res.status(404).json({
                success: false,
                message: 'Nurse not found'
            });
        }
        res.json({
            success: true,
            data: nurse.assignedPatients
        });
    }
    catch (error) {
        console.error('Error fetching assigned patients:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assigned patients'
        });
    }
});
exports.getAssignedPatients = getAssignedPatients;
