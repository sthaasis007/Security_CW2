import { ActivityRepository } from "./activity.repository";

export const ActivityService = {
  async log(action: string, description?: string, metadata: Record<string, any> = {}, user?: { id?: string | null; email?: string | null; username?: string | null; role?: string | null }, req?: any) {
    const payload: Record<string, any> = {
      action,
      description: description || null,
      metadata,
      timestamp: new Date(),
    };

    // Extract user agent from request
    if (req) {
      payload.userAgent = req.get?.("user-agent") || null;
    } else {
      payload.userAgent = null;
    }

    if (user?.id != null) payload.userId = user.id;
    if (user?.username != null) payload.username = user.username;
    if (user?.role != null) payload.role = user.role;
    if (user?.email != null) payload.userEmail = user.email;

    return ActivityRepository.create(payload);
  },

  async list(filters: Record<string, any> = {}) {
    return ActivityRepository.list(filters);
  },

  async search(query: string) {
    return ActivityRepository.search(query);
  },
};
