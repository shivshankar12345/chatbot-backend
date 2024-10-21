import { Router } from "express";
import {
  startChatSession,
  handleCustomerReply,
} from "../controller/chatController";

const router = Router();

router.post("/start", startChatSession);
router.post("/reply", handleCustomerReply);

export default router;
