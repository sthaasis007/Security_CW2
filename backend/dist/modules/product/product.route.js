"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_middleware_1 = __importDefault(require("../../middleware/admin.middleware"));
const upload_middleware_1 = __importDefault(require("../../middleware/upload.middleware"));
const product_controller_1 = __importDefault(require("./product.controller"));
const rateLimit_middleware_1 = __importDefault(require("../../middleware/rateLimit.middleware"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const api_schemas_1 = require("../../validation/api.schemas");
const router = (0, express_1.Router)();
const uploadRateLimit = (0, rateLimit_middleware_1.default)({ windowMs: 60 * 60 * 1000, max: 20, keyPrefix: "product-upload" });
router.post("/", uploadRateLimit, admin_middleware_1.default, (0, upload_middleware_1.default)("image"), (0, validation_middleware_1.validate)({ body: api_schemas_1.productCreateBody, query: api_schemas_1.emptyQuery }), product_controller_1.default.create);
router.get("/", admin_middleware_1.default, (0, validation_middleware_1.validate)({ query: api_schemas_1.emptyQuery }), product_controller_1.default.list);
router.put("/:id", uploadRateLimit, admin_middleware_1.default, (0, validation_middleware_1.validate)({ params: api_schemas_1.idParams }), (0, upload_middleware_1.default)("image"), (0, validation_middleware_1.validate)({ body: api_schemas_1.productUpdateBody, query: api_schemas_1.emptyQuery }), product_controller_1.default.update);
router.delete("/:id", admin_middleware_1.default, (0, validation_middleware_1.validate)({ params: api_schemas_1.idParams, body: api_schemas_1.emptyObject, query: api_schemas_1.emptyQuery }), product_controller_1.default.remove);
exports.default = router;
//# sourceMappingURL=product.route.js.map