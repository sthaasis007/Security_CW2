"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.default, cart_controller_1.CartController.getCart);
router.post("/add", auth_middleware_1.default, cart_controller_1.CartController.addItem);
router.put("/update/:productId", auth_middleware_1.default, cart_controller_1.CartController.updateItem);
router.delete("/remove/:productId", auth_middleware_1.default, cart_controller_1.CartController.removeItem);
router.delete("/clear", auth_middleware_1.default, cart_controller_1.CartController.clearCart);
exports.default = router;
//# sourceMappingURL=cart.route.js.map