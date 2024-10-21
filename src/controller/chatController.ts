import { RequestHandler } from "express";
import { ChatSession, BotConfig } from "../models/botModel";
import { v4 as uuidv4 } from "uuid";
import { successResponse, errorResponse } from "../utils/responseHandler";

export const startChatSession: RequestHandler = async (
  req,
  res
): Promise<void> => {
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
    let session: any;

    if (sessionId && sessionId !== "") {
      // If a sessionId is provided, find the existing session
      session = await ChatSession.findOne({ sessionId });
      // Check if the session exists
      if (!session) {
        res.status(404).json({ error: true, message: "Session not found" });
        return;
      }
    } else if (business && business !== "") {
      // If no sessionId is provided, look for the bot configuration
      const bot = await BotConfig.findOne({ business });

      // If the bot is not configured, return a 404 error
      if (!bot) {
        res.status(404).json({
          error: true,
          message: "Bot not configured for this business",
        });
        return;
      }
    } else {
      // Create a new chat session
      session = new ChatSession({
        sessionId: uuidv4(), // Generate a new unique session ID
        business: "My Business", // Store the business name
        currentStep: "start", // Start at the beginning of the conversation
        chatHistory: [], // Initialize an empty chat history
      });
      await session.save(); // Save the new session to the database
    }

    // Send a success response with the session details
    successResponse(res, {
      sessionId: session.sessionId,
      currentStep: session.currentStep,
    });
  } catch (error: any) {
    // Handle any unexpected errors
    errorResponse(res, error.message, 500);
  }
};

// Handle customer reply and move to the next step in the bot conversation
export const handleCustomerReply: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const { sessionId, reply } = req.body;

  try {
    const session = await ChatSession.findOne({ sessionId });

    if (!session) {
      res.status(404).json({ error: true, message: "Session not found" });
      return;
    }

    const bot = await BotConfig.findOne({ business: session.business });
    const conversationTree: Record<string, any> | undefined =
      bot?.conversationTree;

    const currentStep = session.currentStep;
    const nextStep = conversationTree?.[currentStep]?.options[reply];

    if (!nextStep) {
      res.status(400).json({ error: true, message: "Invalid reply" });
      return;
    }

    session.currentStep = nextStep;
    session.chatHistory.push({ step: currentStep, reply });

    await session.save();

    successResponse(res, {
      currentStep: session.currentStep,
      question: conversationTree?.[nextStep]?.question,
      options: conversationTree?.[nextStep]?.options || {},
    });
  } catch (error: any) {
    errorResponse(res, error.message, 500);
  }
};
