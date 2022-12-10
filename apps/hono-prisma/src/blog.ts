import { Hono } from "hono";
import { client } from "./prisma";
import { validator } from "hono/validator";

export const blogRouter = new Hono();

blogRouter.get("/", async (c) => {
  const blogs = await client.blog.findMany({
    select: { id: true, title: true, author: { select: { username: true } } },
  });
  return c.json(blogs);
});

blogRouter.get("/:id", async (c) => {
  const blog = await client.blog.findUnique({
    where: { id: +c.req.param("id") },
    select: {
      id: true,
      title: true,
      content: true,
      author: { select: { username: true } },
    },
  });
  if (!blog) return c.body(null, 404);
  return c.json(blog);
});

blogRouter.post(
  "/",
  validator((v) => ({
    title: v.json("title").isRequired().message("title is required"),
    content: v.json("content").isRequired().message("content is required"),
  })),
  async (c) => {
    const username = c.req.headers.get("x-username")!;
    const user = await client.user.findUnique({ where: { username } });
    if (!user) return c.body(null, 401);
    const body = c.req.valid();
    const blog = await client.blog.create({
      data: { title: body.title, content: body.content, authorId: user.id },
    });
    return c.json({ id: blog.id }, 201);
  }
);

blogRouter.delete("/:id", async (c) => {
  const username = c.req.headers.get("x-username")!;
  const user = await client.user.findUnique({ where: { username } });
  if (!user) return c.body(null, 401);
  const blog = await client.blog.findUnique({
    where: { id: +c.req.param("id") },
  });
  if (!blog) return c.body(null, 400);
  if (blog.authorId !== user?.id) return c.body(null, 401);
  await client.blog.delete({ where: { id: blog.id } });
  return c.json({ id: blog.id });
});

blogRouter.get("/:id/comments", async (c) => {
  const comments = await client.comment.findMany({
    where: { blogId: +c.req.param("id") },
    select: { id: true, content: true, user: { select: { username: true } } },
  });
  return c.json(comments);
});
