import { ProductModel } from "./product.model";

export const ProductRepository = {
  findById: (id: string) => ProductModel.findById(id).lean(),
  findAll: (filters: Record<string, any> = {}) => ProductModel.find(filters).lean(),
  create: (data: Record<string, any>) => ProductModel.create(data),
  update: (id: string, data: Record<string, any>) => ProductModel.findByIdAndUpdate(id, data, { new: true }).lean(),
  delete: (id: string) => ProductModel.findByIdAndDelete(id),
};
