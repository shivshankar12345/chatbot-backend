import { RequestHandler } from "express";
import { BotConfig } from "../models/botModel";

// Create or update bot configuration
export const createOrUpdateBotConfig: RequestHandler = async (
  req,
  res
): Promise<void> => {
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
    const bot = await BotConfig.findOneAndUpdate(
      { business },
      { conversationTree },
      { upsert: true, new: true }
    );

    if (!bot) {
      res.status(400).json({
        error: true,
        message: "Failed to update or create the bot configuration",
      });
    } else {
      res.status(200).json({
        error: false,
        message: "Bot configuration updated successfully",
        data: bot,
      });
    }
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

// Get bot configuration by business
export const getBotConfig: RequestHandler = async (req, res): Promise<void> => {
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
    const bot = await BotConfig.findOne({ business });

    console.log("Bot", bot);

    if (!bot) {
      res.status(404).json({
        error: true,
        message: "No bot found for the provided business",
      });
    } else {
      res.status(200).json({
        error: false,
        message: "Bot configuration fetched successfully",
        data: bot.conversationTree,
      });
    }
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

export const getBusinesses: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const bot = await BotConfig.find();

    console.log("Bot", bot);

    if (!bot) {
      res.status(404).json({
        error: true,
        message: "No Bot Found",
      });
    } else {
      res.status(200).json({
        error: false,
        message: "Bots fetched successfully",
        data: bot,
      });
    }
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};
