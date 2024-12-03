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
exports.updateRequestStatus = exports.assignRequest = exports.getRequests = exports.createRequest = void 0;
const Request_1 = require("../models/Request");
const Patient_1 = require("../models/Patient");
const Nurse_1 = require("../models/Nurse");
const AppError_1 = require("../utils/AppError");
const server_1 = require("../server");
const createRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new AppError_1.AppError('Authentication required', 401);
        }
        const patient = yield Patient_1.Patient.findOne({ user: req.user._id }).populate('user');
        if (!patient) {
            throw new AppError_1.AppError('Patient not found', 404);
        }
        const request = yield Request_1.Request.create(Object.assign(Object.assign({}, req.body), { patient: patient._id, status: 'pending' }));
        yield request.populate([
            { path: 'patient', populate: { path: 'user', select: 'fullName' } },
            { path: 'nurse', populate: { path: 'user', select: 'fullName' } },
        ]);
        server_1.socketService === null || server_1.socketService === void 0 ? void 0 : server_1.socketService.emitToRole('nurse', 'new_request', {
            request,
            patient: {
                id: patient._id,
                name: patient.user.fullName,
            },
        });
        res.status(201).json({
            success: true,
            data: request,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof AppError_1.AppError ? error.message : 'Failed to create request',
        });
    }
});
exports.createRequest = createRequest;
const getRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new AppError_1.AppError('Authentication required', 401);
        }
        let query = {};
        // If nurse, only show assigned requests
        if (req.user.role === 'nurse') {
            const nurse = yield Nurse_1.Nurse.findOne({ user: req.user._id });
            if (!nurse) {
                throw new AppError_1.AppError('Nurse not found', 404);
            }
            query = { nurse: nurse._id };
        }
        // If patient, only show their requests
        if (req.user.role === 'patient') {
            const patient = yield Patient_1.Patient.findOne({ user: req.user._id });
            if (!patient) {
                throw new AppError_1.AppError('Patient not found', 404);
            }
            query = { patient: patient._id };
        }
        const requests = yield Request_1.Request.find(query)
            .populate({
            path: 'patient',
            populate: { path: 'user', select: 'fullName' }
        })
            .populate({
            path: 'nurse',
            populate: { path: 'user', select: 'fullName' }
        })
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: requests,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof AppError_1.AppError ? error.message : 'Failed to fetch requests',
        });
    }
});
exports.getRequests = getRequests;
const assignRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId, nurseId } = req.body;
        const request = yield Request_1.Request.findById(requestId);
        if (!request) {
            throw new AppError_1.AppError('Request not found', 404);
        }
        const nurse = yield Nurse_1.Nurse.findById(nurseId).populate('user');
        if (!nurse) {
            throw new AppError_1.AppError('Nurse not found', 404);
        }
        request.nurse = nurse._id;
        request.status = 'assigned';
        yield request.save();
        // Notify assigned nurse
        server_1.socketService === null || server_1.socketService === void 0 ? void 0 : server_1.socketService.emitToUser(nurse.user._id.toString(), 'request_assigned', {
            request,
            nurse: { id: nurse._id, name: nurse.user.fullName },
        });
        // Notify patient
        const patient = yield Patient_1.Patient.findById(request.patient).populate('user');
        if (patient) {
            server_1.socketService === null || server_1.socketService === void 0 ? void 0 : server_1.socketService.emitToUser(patient.user._id.toString(), 'request_assigned', {
                request,
                nurse: { id: nurse._id, name: nurse.user.fullName },
            });
        }
        res.json({
            success: true,
            data: request,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof AppError_1.AppError ? error.message : 'Failed to assign request',
        });
    }
});
exports.assignRequest = assignRequest;
const updateRequestStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId, status } = req.body;
        const request = yield Request_1.Request.findById(requestId);
        if (!request) {
            throw new AppError_1.AppError('Request not found', 404);
        }
        const oldStatus = request.status;
        request.status = status;
        yield request.save();
        // Notify all relevant parties
        const patient = yield Patient_1.Patient.findById(request.patient).populate('user');
        if (patient) {
            server_1.socketService === null || server_1.socketService === void 0 ? void 0 : server_1.socketService.emitToUser(patient.user._id.toString(), 'request_status_updated', {
                request,
                oldStatus,
                newStatus: status,
            });
        }
        const nurse = yield Nurse_1.Nurse.findById(request.nurse).populate('user');
        if (nurse) {
            server_1.socketService === null || server_1.socketService === void 0 ? void 0 : server_1.socketService.emitToUser(nurse.user._id.toString(), 'request_status_updated', {
                request,
                oldStatus,
                newStatus: status,
            });
        }
        res.json({
            success: true,
            data: request,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof AppError_1.AppError ? error.message : 'Failed to update request status',
        });
    }
});
exports.updateRequestStatus = updateRequestStatus;
