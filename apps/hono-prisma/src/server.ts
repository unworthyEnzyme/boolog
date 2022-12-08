import { serve } from "@honojs/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRouter } from "./auth";

const app = new Hono();

app.use("*", logger());
app.get("/api", (c) => c.text("Hono meets Node.js"));
app.route("/api/auth", authRouter);

app.onError((e, c) => {
  c.status(400);
  return c.json({});
});

serve(app);
