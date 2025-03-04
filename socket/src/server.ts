import express from "express";
import compression from "compression";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMangoDb from "./db/connectMango.js";

import cors from "cors";
import "reflect-metadata";
import "express-async-errors";
import Conversation from "./controllers/conversation.controller.js";

import { ExpressApplication } from "./bootstraper.js";
import Message from "./controllers/message.controller.js";
import globalErrorHandler from "./middlewares/errorHandler.js";
import setupIoServer from "./socket/socket.js";
import httpLogger from "./middlewares/logger.js";

import redisClient from "./redis.js";
import logger from "./utils/logger.js";

import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = new ExpressApplication({
  port: process.env.PORT || 3000,
  middlewares: [
    express.json({ limit: "20kb" }),
    compression(),
    cookieParser(),
    cors({
      origin: "*",
      credentials: true,
    }),
    express.static(__dirname + "../public"),
    httpLogger,
  ],
  controllers: [Conversation, Message],
  errorHandler: [globalErrorHandler],
});

connectMangoDb()
  .then(async (mango) => {
    logger.info("Connected to mango database");
    const server = app.start();

    const redis = await redisClient.connect();

    const io = await setupIoServer(server, redis);

    logger.info("Socket server started");

    const shutdown = async () => {
      try {
        await redis.disconnect();
        console.log("Redis connection closed");
      } catch (err) {
        console.log("Error closing redis connection", err);
      }

      try {
        await io.close();
        console.log("Socket server closed");
      } catch (err) {
        console.log("Error closing socket connection", err);
      }

      server.close(async () => {
        console.log("Server closed");
        mango.disconnect().then(() => {
          console.log("Mango database connection closed");
        });
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  })
  .catch((error) => {
    console.log("Error connecting to mango database", error);
    process.exit(1);
  });
