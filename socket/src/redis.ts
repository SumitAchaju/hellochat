import { createClient } from "redis";

const redisClient = createClient({
  username: "default",
  password: "3TRpKZZQZaa9UJHapdFGYuK2RK4YcGq5",
  socket: {
    host: "redis-12509.c301.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 12509,
  },
});

redisClient.on("error", (error) => {
  console.log("Redis connection error", error);
});
redisClient.on("connect", () => {
  console.log("Redis connected");
});

export default redisClient;
