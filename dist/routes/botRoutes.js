"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const botController_1 = require("../controller/botController");
const router = (0, express_1.Router)();
router.post("/config", botController_1.createOrUpdateBotConfig);
router.get("/business/:business", botController_1.getBotConfig);
router.get("/getBusiness", botController_1.getBusinesses);
exports.default = router;
