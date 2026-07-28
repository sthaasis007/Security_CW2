"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("./admin.controller"));
const admin_middleware_1 = __importDefault(require("../../middleware/admin.middleware"));
const upload_middleware_1 = __importDefault(require("../../middleware/upload.middleware"));
const product_route_1 = __importDefault(require("../product/product.route"));
const rateLimit_middleware_1 = __importDefault(require("../../middleware/rateLimit.middleware"));
const router = (0, express_1.Router)();
const adminRateLimit = (0, rateLimit_middleware_1.default)({ windowMs: 60 * 1000, max: 30, keyPrefix: "admin" });
const uploadRateLimit = (0, rateLimit_middleware_1.default)({ windowMs: 60 * 60 * 1000, max: 20, keyPrefix: "upload" });
router.post("/users", adminRateLimit, uploadRateLimit, admin_middleware_1.default, (0, upload_middleware_1.default)("image"), admin_controller_1.default.create);
router.get("/users", adminRateLimit, admin_middleware_1.default, admin_controller_1.default.list);
router.get("/users/:id", adminRateLimit, admin_middleware_1.default, admin_controller_1.default.get);
router.put("/users/:id", adminRateLimit, uploadRateLimit, admin_middleware_1.default, (0, upload_middleware_1.default)("image"), admin_controller_1.default.update);
router.delete("/users/:id", adminRateLimit, admin_middleware_1.default, admin_controller_1.default.remove);
router.use("/products", product_route_1.default);
exports.default = router;
//# sourceMappingURL=admin.route.js.map