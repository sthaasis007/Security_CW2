"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activity_controller_1 = require("./activity.controller");
const admin_middleware_1 = __importDefault(require("../../middleware/admin.middleware"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const api_schemas_1 = require("../../validation/api.schemas");
const router = (0, express_1.Router)();
router.get("/", admin_middleware_1.default, (0, validation_middleware_1.validate)({ query: api_schemas_1.activityQuery }), activity_controller_1.ActivityController.list);
exports.default = router;
//# sourceMappingURL=activity.route.js.map