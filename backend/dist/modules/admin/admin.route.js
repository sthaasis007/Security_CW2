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
const router = (0, express_1.Router)();
router.post("/users", admin_middleware_1.default, (0, upload_middleware_1.default)("image"), admin_controller_1.default.create);
router.get("/users", admin_middleware_1.default, admin_controller_1.default.list);
router.get("/users/:id", admin_middleware_1.default, admin_controller_1.default.get);
router.put("/users/:id", admin_middleware_1.default, (0, upload_middleware_1.default)("image"), admin_controller_1.default.update);
router.delete("/users/:id", admin_middleware_1.default, admin_controller_1.default.remove);
router.use("/products", product_route_1.default);
exports.default = router;
//# sourceMappingURL=admin.route.js.map