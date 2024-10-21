import { Router } from "express";
import {
  createOrUpdateBotConfig,
  getBotConfig,
  getBusinesses,
} from "../controller/botController";

const router = Router();

router.post("/config", createOrUpdateBotConfig);
router.get("/business/:business", getBotConfig);
router.get("/getBusiness", getBusinesses);

export default router;
