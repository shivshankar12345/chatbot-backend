import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";
import botRoutes from "./routes/botRoutes";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();
connectDB();

const app: Application = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/bot", botRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
