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
exports.registerPatient = exports.getUsersByRole = exports.approveNurse = exports.getPendingNurses = exports.updateUser = exports.getUsers = void 0;
const User_1 = require("../models/User");
const types_1 = require("../types");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, department, status } = req.query;
        const filter = { active: true };
        if (role)
            filter.role = role;
        if (department)
            filter.department = department;
        if (status)
            filter.status = status;
        const users = yield User_1.User.find(filter)
            .select('-password')
            .populate('department', 'name');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});
exports.getUsers = getUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { firstName, lastName, department, room, active, status } = req.body;
        const user = yield User_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        if (department)
            user.department = department;
        if (room)
            user.room = room;
        if (typeof active === 'boolean')
            user.active = active;
        if (status && Object.values(types_1.UserStatus).includes(status)) {
            user.status = status;
        }
        yield user.save();
        res.json({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            department: user.department,
            room: user.room,
            active: user.active,
            status: user.status
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
});
exports.updateUser = updateUser;
const getPendingNurses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingNurses = yield User_1.User.find({
            role: 'nurse',
            status: types_1.UserStatus.PENDING,
            active: true
        })
            .select('-password')
            .populate('department', 'name');
        res.json(pendingNurses);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching pending nurses', error });
    }
});
exports.getPendingNurses = getPendingNurses;
const approveNurse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!Object.values(types_1.UserStatus).includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const nurse = yield User_1.User.findOneAndUpdate({ _id: id, role: 'nurse' }, { status }, { new: true }).select('-password');
        if (!nurse) {
            return res.status(404).json({ message: 'Nurse not found' });
        }
        res.json(nurse);
    }
    catch (error) {
        res.status(500).json({ message: 'Error approving nurse', error });
    }
});
exports.approveNurse = approveNurse;
const getUsersByRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, status } = req.query;
        if (!role) {
            return res.status(400).json({ message: 'Role parameter is required' });
        }
        // Build query based on parameters
        const query = { role };
        if (status) {
            query.status = status;
        }
        const users = yield User_1.User.find(query)
            .select('-password')
            .sort({ firstName: 1, lastName: 1 });
        res.json({
            users,
            count: users.length,
        });
    }
    catch (error) {
        console.error('Error fetching users by role:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});
exports.getUsersByRole = getUsersByRole;
const registerPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstName, lastName, room } = req.body;
        // Check if user with email already exists
        const existingUser = yield User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email already exists',
            });
        }
        // Create new patient user
        const user = new User_1.User({
            email,
            password,
            firstName,
            lastName,
            room,
            role: 'patient',
            status: 'approved', // Patients registered by nurses are automatically approved
        });
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(password, salt);
        yield user.save();
        res.status(201).json({
            message: 'Patient registered successfully',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                room: user.room,
            },
        });
    }
    catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ message: 'Error registering patient' });
    }
});
exports.registerPatient = registerPatient;
