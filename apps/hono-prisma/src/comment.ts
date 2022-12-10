import { Hono } from "hono";
import { validator } from "hono/validator";
import { client } from "./prisma";

export const commentRouter = new Hono();

commentRouter.get("/:id", async (c) => {
  const comment = await client.comment.findUnique({
    where: { id: +c.req.param("id") },
    select: {
      id: true,
      content: true,
      user: { select: { username: true } },
    },
  });
  if (!comment) return c.body(null, 404);
  return c.json(comment);
});

commentRouter.post(
  "/",
  validator((v) => ({
    content: v.json("content").isRequired().message("content is required"),
    blogId: v
      .json("blogId")
      .asNumber()
      .isRequired()
      .message("`blogId` is required"),
  })),
  async (c) => {
    const username = c.req.headers.get("x-username")!;
    const user = await client.user.findUnique({ where: { username } });
    if (!user) return c.body(null, 401);
    const body = c.req.valid();
    const comment = await client.comment.create({
      data: { content: body.content, userId: user.id, blogId: body.blogId },
    });
    return c.json({ id: comment.id }, 201);
  }
);

commentRouter.delete("/:id", async (c) => {
  const username = c.req.headers.get("x-username")!;
  const user = await client.user.findUnique({ where: { username } });
  if (!user) return c.body(null, 401);
  const comment = await client.comment.findUnique({
    where: { id: +c.req.param("id") },
  });
  if (!comment) return c.body(null, 400);
  if (comment.userId !== user.id) return c.body(null, 401);
  await client.comment.delete({ where: { id: comment.id } });
  return c.json({ id: comment.id });
});

commentRouter.patch(
  "/:id",
  validator((v) => ({
    content: v.json("content").isRequired(),
  })),
  async (c) => {
    const username = c.req.headers.get("x-username")!;
    const user = await client.user.findUnique({ where: { username } });
    if (!user) return c.body(null, 401);
    const comment = await client.comment.findUnique({
      where: { id: +c.req.param("id") },
    });
    if (!comment) return c.body(null, 400);
    if (comment.userId !== user.id) return c.body(null, 401);
    const { content } = c.req.valid();
    await client.comment.update({
      where: { id: comment.id },
      data: { content },
    });
    return c.json({ content });
  }
);
