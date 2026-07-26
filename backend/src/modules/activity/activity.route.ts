import { Router } from "express";
import { ActivityController } from "./activity.controller";
import adminOnly from "../../middleware/admin.middleware";

const router = Router();

router.get("/", adminOnly, ActivityController.list);

export default router;
