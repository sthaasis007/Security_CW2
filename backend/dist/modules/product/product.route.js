"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_middleware_1 = __importDefault(require("../../middleware/admin.middleware"));
const upload_middleware_1 = __importDefault(require("../../middleware/upload.middleware"));
const product_controller_1 = __importDefault(require("./product.controller"));
const router = (0, express_1.Router)();
router.post("/", admin_middleware_1.default, (0, upload_middleware_1.default)("image"), product_controller_1.default.create);
router.get("/", admin_middleware_1.default, product_controller_1.default.list);
router.put("/:id", admin_middleware_1.default, (0, upload_middleware_1.default)("image"), product_controller_1.default.update);
router.delete("/:id", admin_middleware_1.default, product_controller_1.default.remove);
exports.default = router;
//# sourceMappingURL=product.route.js.map