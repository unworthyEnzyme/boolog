import { Context, Next } from "hono";
import { client } from "./redis";
import { RedisSessionStore } from "./RedisSessionStore";

export const sessionStore = new RedisSessionStore(client);

export async function authenticated(c: Context, next: Next) {
  const sessionId = c.req.cookie("sessionId");
  if (!sessionId) return c.body(null, 401);
  const session = await sessionStore.get(sessionId);
  if (!session) return c.body(null, 401);
  c.req.headers.set("x-username", session.username);
  await next();
}
