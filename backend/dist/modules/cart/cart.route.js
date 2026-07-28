"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const api_schemas_1 = require("../../validation/api.schemas");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.default, (0, validation_middleware_1.validate)({ query: api_schemas_1.emptyQuery }), cart_controller_1.CartController.getCart);
router.post("/add", auth_middleware_1.default, (0, validation_middleware_1.validate)({ body: api_schemas_1.cartAddBody, query: api_schemas_1.emptyQuery }), cart_controller_1.CartController.addItem);
router.put("/update/:productId", auth_middleware_1.default, (0, validation_middleware_1.validate)({ params: api_schemas_1.productParams, body: api_schemas_1.cartUpdateBody, query: api_schemas_1.emptyQuery }), cart_controller_1.CartController.updateItem);
router.delete("/remove/:productId", auth_middleware_1.default, (0, validation_middleware_1.validate)({ params: api_schemas_1.productParams, body: api_schemas_1.emptyObject, query: api_schemas_1.emptyQuery }), cart_controller_1.CartController.removeItem);
router.delete("/clear", auth_middleware_1.default, (0, validation_middleware_1.validate)({ body: api_schemas_1.emptyObject, query: api_schemas_1.emptyQuery }), cart_controller_1.CartController.clearCart);
exports.default = router;
//# sourceMappingURL=cart.route.js.map