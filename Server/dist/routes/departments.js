"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const departmentController_1 = require("../controllers/departmentController");
const router = (0, express_1.Router)();
// Get all departments
router.get('/', departmentController_1.getAllDepartments);
exports.default = router;
