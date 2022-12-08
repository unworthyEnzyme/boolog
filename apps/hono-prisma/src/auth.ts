import { Hono } from "hono";
import { validator } from "hono/validator";
import { client } from "./prisma";
import argon2 from "argon2";

export const authRouter = new Hono();

authRouter.post(
  "/signup",
  validator((v) => ({
    username: v
      .json("username")
      .isRequired()
      .isLength({ min: 1 })
      .message("username is required and cannot be empty"),
    password: v
      .json("password")
      .isRequired()
      .isLength({ min: 1 })
      .message("password is required and cannot be empty"),
  })),
  async (c) => {
    const body = c.req.valid();
    body.password = await argon2.hash(body.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
    });
    const saved = await client.user.create({
      data: { username: body.username, password: body.password },
    });
    return c.json({ id: saved.id });
  }
);

authRouter.post(
  "/login",
  validator((v) => ({
    username: v
      .json("username")
      .isRequired()
      .isLength({ min: 1 })
      .message("username is required and cannot be empty"),
    password: v
      .json("password")
      .isRequired()
      .isLength({ min: 1 })
      .message("password is required and cannot be empty"),
  })),
  async (c) => {
    const body = c.req.valid();
    const user = await client.user.findUnique({
      where: { username: body.username },
    });
    const verified = await argon2.verify(user?.password!, body.password);
    if (!verified) throw new Error("Incorrect Credentials");
    return c.json({});
  }
);

authRouter.get("/me", async (c) => {
  return c.text("hello");
});
