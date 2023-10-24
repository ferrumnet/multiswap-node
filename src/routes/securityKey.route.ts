import { Router } from "express";
import { securityKeyController } from "../controllers";
import auth from "../middlewares/auth.middleware";
const router = Router();

router.route("/").post(auth(), securityKeyController.setSecurityKey);
export default router;
