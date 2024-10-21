"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controller/chatController");
const router = (0, express_1.Router)();
router.post("/start", chatController_1.startChatSession);
router.post("/reply", chatController_1.handleCustomerReply);
exports.default = router;
