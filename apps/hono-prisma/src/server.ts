import { serve } from "@honojs/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRouter } from "./auth";
import { client as redisClient } from "./redis";
import { client as prismaClient } from "./prisma";
import { authenticated } from "./session";
import { blogRouter } from "./blog";
import { commentRouter } from "./comment";

const app = new Hono();

app.use("*", logger());
app.use("*", authenticated);
app.get("/api", (c) => c.text("Hono meets Node.js"));
app.route("/api/auth", authRouter);
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
