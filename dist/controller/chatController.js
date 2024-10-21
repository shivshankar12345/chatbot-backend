"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCustomerReply = exports.startChatSession = void 0;
const botModel_1 = require("../models/botModel");
const uuid_1 = require("uuid");
const responseHandler_1 = require("../utils/responseHandler");
const startChatSession = async (req, res) => {
    const { business, sessionId } = req.body;
    // let session;
    console.log("Business, session", business, sessionId);
    // Check if both business and sessionId are missing
    // if (!business && !sessionId) {
    //   res
    //     .status(400)
    //     .json({ error: true, message: "Business and sessionId are required." });
    // }
    try {
        let session;
        if (sessionId && sessionId !== "") {
            // If a sessionId is provided, find the existing session
            session = await botModel_1.ChatSession.findOne({ sessionId });
            // Check if the session exists
            if (!session) {
                res.status(404).json({ error: true, message: "Session not found" });
                return;
            }
        }
        else if (business && business !== "") {
            // If no sessionId is provided, look for the bot configuration
            const bot = await botModel_1.BotConfig.findOne({ business });
            // If the bot is not configured, return a 404 error
            if (!bot) {
                res.status(404).json({
                    error: true,
                    message: "Bot not configured for this business",
                });
                return;
            }
        }
        else {
            // Create a new chat session
            session = new botModel_1.ChatSession({
                sessionId: (0, uuid_1.v4)(),
                business: "My Business",
                currentStep: "start",
                chatHistory: [], // Initialize an empty chat history
            });
            await session.save(); // Save the new session to the database
        }
        // Send a success response with the session details
        (0, responseHandler_1.successResponse)(res, {
            sessionId: session.sessionId,
            currentStep: session.currentStep,
        });
    }
    catch (error) {
        // Handle any unexpected errors
        (0, responseHandler_1.errorResponse)(res, error.message, 500);
    }
};
exports.startChatSession = startChatSession;
// Handle customer reply and move to the next step in the bot conversation
const handleCustomerReply = async (req, res) => {
    var _a, _b, _c;
    const { sessionId, reply } = req.body;
    try {
        const session = await botModel_1.ChatSession.findOne({ sessionId });
        if (!session) {
            res.status(404).json({ error: true, message: "Session not found" });
            return;
        }
        const bot = await botModel_1.BotConfig.findOne({ business: session.business });
        const conversationTree = bot === null || bot === void 0 ? void 0 : bot.conversationTree;
        const currentStep = session.currentStep;
        const nextStep = (_a = conversationTree === null || conversationTree === void 0 ? void 0 : conversationTree[currentStep]) === null || _a === void 0 ? void 0 : _a.options[reply];
        if (!nextStep) {
            res.status(400).json({ error: true, message: "Invalid reply" });
            return;
        }
        session.currentStep = nextStep;
        session.chatHistory.push({ step: currentStep, reply });
        await session.save();
        (0, responseHandler_1.successResponse)(res, {
            currentStep: session.currentStep,
            question: (_b = conversationTree === null || conversationTree === void 0 ? void 0 : conversationTree[nextStep]) === null || _b === void 0 ? void 0 : _b.question,
            options: ((_c = conversationTree === null || conversationTree === void 0 ? void 0 : conversationTree[nextStep]) === null || _c === void 0 ? void 0 : _c.options) || {},
        });
    }
    catch (error) {
        (0, responseHandler_1.errorResponse)(res, error.message, 500);
    }
};
exports.handleCustomerReply = handleCustomerReply;
