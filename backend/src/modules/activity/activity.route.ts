import { Router } from "express";
import { ActivityController } from "./activity.controller";
import adminOnly from "../../middleware/admin.middleware";
import { validate } from "../../middleware/validation.middleware";
import { activityQuery } from "../../validation/api.schemas";

const router = Router();

router.get("/", adminOnly, validate({ query: activityQuery }), ActivityController.list);

export default router;
