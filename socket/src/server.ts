import express from "express";
import http from "http";

import "reflect-metadata";
import dotenv from "dotenv";

import redisClient from "./redis.js";

import setupIoServer from "./socket.js";
import connectMangoDb from "./db/connectMango.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const redis = await redisClient.connect();

const io = await setupIoServer(server, redis);

connectMangoDb()
  .then((mango) => {
    console.log("Connected to mango database");
    server.listen(process.env.PORT || 5000, () => {
      console.log("Server is running on port 5000");
    });
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
  });
