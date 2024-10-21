import mongoose, { Document, Schema } from "mongoose";

// Interface for BotConfig model type
interface IBotConfig extends Document {
  business: string;
  conversationTree: object;
}

// Interface for ChatSession model type
interface IChatSession extends Document {
  sessionId: string;
  business: string;
  currentStep: string;
  chatHistory: Array<{ step: string; reply: string }>;
}

//Bot config Schema
const BotConfigSchema = new Schema(
  {
    business: {
      type: String,
      required: true,
      unique: true,
    },
    conversationTree: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

//Chat Session Schema

const ChatSessionSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

const BotConfig = mongoose.model<IBotConfig>("BotConfig", BotConfigSchema);
const ChatSession = mongoose.model<IChatSession>(
  "ChatSession",
  ChatSessionSchema
);

export { BotConfig, ChatSession };
