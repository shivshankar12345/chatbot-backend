"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBusinesses = exports.getBotConfig = exports.createOrUpdateBotConfig = void 0;
const botModel_1 = require("../models/botModel");
// Create or update bot configuration
const createOrUpdateBotConfig = async (req, res) => {
    const { business, conversationTree } = req.body;
    console.log("Business", business, conversationTree);
    if (!business || !conversationTree) {
        res.status(400).json({
            error: true,
            message: "Business and conversationTree are required",
        });
        return; // Ensure the function returns void here
    }
    try {
        const bot = await botModel_1.BotConfig.findOneAndUpdate({ business }, { conversationTree }, { upsert: true, new: true });
        if (!bot) {
            res.status(400).json({
                error: true,
                message: "Failed to update or create the bot configuration",
            });
        }
        else {
            res.status(200).json({
                error: false,
                message: "Bot configuration updated successfully",
                data: bot,
            });
        }
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};
exports.createOrUpdateBotConfig = createOrUpdateBotConfig;
// Get bot configuration by business
const getBotConfig = async (req, res) => {
    const business = req.params.business;
    console.log("Business", business);
    if (!business) {
        res.status(400).json({
            error: true,
            message: "Business name is required",
        });
        return; // Ensure the function returns void here
    }
    try {
        const bot = await botModel_1.BotConfig.findOne({ business });
        console.log("Bot", bot);
        if (!bot) {
            res.status(404).json({
                error: true,
                message: "No bot found for the provided business",
            });
        }
        else {
            res.status(200).json({
                error: false,
                message: "Bot configuration fetched successfully",
                data: bot.conversationTree,
            });
        }
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};
exports.getBotConfig = getBotConfig;
const getBusinesses = async (req, res) => {
    try {
        const bot = await botModel_1.BotConfig.find();
        console.log("Bot", bot);
        if (!bot) {
            res.status(404).json({
                error: true,
                message: "No Bot Found",
            });
        }
        else {
            res.status(200).json({
                error: false,
                message: "Bots fetched successfully",
                data: bot,
            });
        }
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};
exports.getBusinesses = getBusinesses;
