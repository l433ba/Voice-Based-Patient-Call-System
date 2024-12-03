"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NursingDepartment = exports.UserStatus = exports.RequestStatus = exports.RequestPriority = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["PATIENT"] = "patient";
    UserRole["NURSE"] = "nurse";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var RequestPriority;
(function (RequestPriority) {
    RequestPriority["LOW"] = "low";
    RequestPriority["MEDIUM"] = "medium";
    RequestPriority["HIGH"] = "high";
})(RequestPriority || (exports.RequestPriority = RequestPriority = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["ASSIGNED"] = "assigned";
    RequestStatus["IN_PROGRESS"] = "in_progress";
    RequestStatus["COMPLETED"] = "completed";
    RequestStatus["CANCELLED"] = "cancelled";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["PENDING"] = "pending";
    UserStatus["APPROVED"] = "approved";
    UserStatus["REJECTED"] = "rejected";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var NursingDepartment;
(function (NursingDepartment) {
    NursingDepartment["EMERGENCY"] = "Emergency";
    NursingDepartment["INTENSIVE_CARE"] = "Intensive Care";
    NursingDepartment["PEDIATRICS"] = "Pediatrics";
    NursingDepartment["MATERNITY"] = "Maternity";
    NursingDepartment["ONCOLOGY"] = "Oncology";
    NursingDepartment["CARDIOLOGY"] = "Cardiology";
    NursingDepartment["NEUROLOGY"] = "Neurology";
    NursingDepartment["ORTHOPEDICS"] = "Orthopedics";
    NursingDepartment["PSYCHIATRY"] = "Psychiatry";
    NursingDepartment["REHABILITATION"] = "Rehabilitation";
    NursingDepartment["GERIATRICS"] = "Geriatrics";
    NursingDepartment["SURGERY"] = "Surgery";
    NursingDepartment["OUTPATIENT"] = "Outpatient";
})(NursingDepartment || (exports.NursingDepartment = NursingDepartment = {}));
