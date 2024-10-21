"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSession = exports.BotConfig = void 0;
const mongoose_1 = __importStar(require("mongoose"));
//Bot config Schema
const BotConfigSchema = new mongoose_1.Schema({
    business: {
        type: String,
        required: true,
        unique: true,
    },
    conversationTree: {
        type: Object,
        required: true,
    },
}, { timestamps: true });
//Chat Session Schema
const ChatSessionSchema = new mongoose_1.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
    },
    business: {
        type: String,
        required: true,
    },
    currentStep: {
        type: String,
        required: true,
    },
    chatHistory: [{ step: String, reply: String }],
}, { timestamps: true });
const BotConfig = mongoose_1.default.model("BotConfig", BotConfigSchema);
exports.BotConfig = BotConfig;
const ChatSession = mongoose_1.default.model("ChatSession", ChatSessionSchema);
exports.ChatSession = ChatSession;
