import { ActivityModel } from "./activity.model";

const sanitizeFilter = (value: string) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const ActivityRepository = {
  create: (data: Record<string, any>) => ActivityModel.create(data),
  list: (filters: Record<string, any> = {}) => ActivityModel.find(filters).sort({ createdAt: -1 }).lean(),
  search: async (query: string) => {
    const safeQuery = sanitizeFilter(query.trim());
    const regex = new RegExp(safeQuery, "i");
    return ActivityModel.find({
      $or: [{ action: regex }, { description: regex }, { userEmail: regex }, { username: regex }],
    }).sort({ createdAt: -1 }).lean();
  },
};
