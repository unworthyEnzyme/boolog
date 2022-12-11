import { serve } from "@honojs/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRouter } from "./auth";
import { client as redisClient } from "./redis";
import { client as prismaClient } from "./prisma";
import { authenticated } from "./session";
import { blogRouter } from "./blog";
import { commentRouter } from "./comment";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());
app.get("/api", (c) => c.json({ hello: "world" }));
app.route("/api/auth", authRouter);
app.use("*", authenticated);
app.route("/api/blogs", blogRouter);
app.route("/api/comments", commentRouter);

app.onError((e, c) => {
  c.status(400);
  return c.json({});
});

(async () => {
  try {
    await redisClient.connect();
    const server = serve(app);
    console.log(server.address());
  } catch (err) {
    await prismaClient.$disconnect();
    await redisClient.quit();
  }
})();
