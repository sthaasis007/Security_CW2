"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const product_model_1 = require("./product.model");
exports.ProductRepository = {
    findById: (id) => product_model_1.ProductModel.findById(id).lean(),
    findAll: (filters = {}) => product_model_1.ProductModel.find(filters).lean(),
    create: (data) => product_model_1.ProductModel.create(data),
    update: (id, data) => product_model_1.ProductModel.findByIdAndUpdate(id, data, { new: true }).lean(),
    delete: (id) => product_model_1.ProductModel.findByIdAndDelete(id),
};
//# sourceMappingURL=product.repository.js.map