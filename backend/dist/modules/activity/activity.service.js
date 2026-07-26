"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const activity_repository_1 = require("./activity.repository");
exports.ActivityService = {
    async log(action, description, metadata = {}, user, req) {
        const payload = {
            action,
            description: description || null,
            metadata,
            timestamp: new Date(),
        };
        // Extract user agent from request
        if (req) {
            payload.userAgent = req.get?.("user-agent") || null;
        }
        else {
            payload.userAgent = null;
        }
        if (user?.id != null)
            payload.userId = user.id;
        if (user?.username != null)
            payload.username = user.username;
        if (user?.role != null)
            payload.role = user.role;
        if (user?.email != null)
            payload.userEmail = user.email;
        return activity_repository_1.ActivityRepository.create(payload);
    },
    async list(filters = {}) {
        return activity_repository_1.ActivityRepository.list(filters);
    },
    async search(query) {
        return activity_repository_1.ActivityRepository.search(query);
    },
};
//# sourceMappingURL=activity.service.js.map