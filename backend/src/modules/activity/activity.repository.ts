import { ActivityModel } from "./activity.model";

export type ActivityPage = { page: number; limit: number; total: number; pages: number; activities: any[] };

export const ActivityRepository = {
  create: (data: Record<string, any>) => ActivityModel.create(data),
  countRecent: (action: string, userId: string | null, since: Date) =>
    ActivityModel.countDocuments({ action, userId, createdAt: { $gte: since } }),
  async list(filters: Record<string, any>, page: number, limit: number): Promise<ActivityPage> {
    const [activities, total] = await Promise.all([
      ActivityModel.find(filters).select("+integrityHash").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      ActivityModel.countDocuments(filters),
    ]);
    return { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)), activities };
  },
};
