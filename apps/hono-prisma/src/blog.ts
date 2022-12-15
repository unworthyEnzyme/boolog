import { Hono } from "hono";
import { client } from "./prisma";
import { validator } from "hono/validator";

export const blogRouter = new Hono();

blogRouter.get(
  "/",
  validator((v) => ({
    skip: v.query("skip").isNumeric().isOptional(),
    take: v
      .query("take")
      .isNumeric()
      .isNumeric()
      .message("take argument is required"),
  })),
  async (c) => {
    const { skip, take } = c.req.valid();
    const blogs = await client.blog.findMany({
      //TODO: use cursor based pagination
      take: +take,
      skip: +skip || 0,
      select: {
        id: true,
        title: true,
        author: { select: { username: true } },
        _count: { select: { comments: true, likes: true, dislikes: true } },
      },
    });
    return c.json(blogs);
  }
);

blogRouter.get("/:id", async (c) => {
  const blog = await client.blog.findUnique({
    where: { id: +c.req.param("id") },
    select: {
      id: true,
      title: true,
      content: true,
      author: { select: { username: true } },
      _count: { select: { comments: true, likes: true, dislikes: true } },
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

blogRouter.get(
  "/:id/comments",
  validator((v) => ({
    skip: v.query("skip").isNumeric().isOptional(),
    take: v
      .query("take")
      .isNumeric()
      .isRequired()
      .message("take argument is required"),
  })),
  async (c) => {
    const { skip, take } = c.req.valid();
    const comments = await client.comment.findMany({
      skip: +skip || 0,
      take: +take,
      where: { blogId: +c.req.param("id") },
      select: { id: true, content: true, user: { select: { username: true } } },
    });
    return c.json(comments);
  }
);

blogRouter.post("/:id/like", async (c) => {
  const username = c.req.headers.get("x-username")!;
  const user = await client.user.findUnique({ where: { username } });
  if (!user) return c.body(null, 401);
  await safe(async () => {
    await client.dislike.delete({
      where: { userId_blogId: { userId: user.id, blogId: +c.req.param("id") } },
    });
  });
  await client.like.create({
    data: { blogId: +c.req.param("id"), userId: user.id },
  });
  return c.body(null, 201);
});

blogRouter.delete("/:id/un-like", async (c) => {
  const username = c.req.headers.get("x-username")!;
  const user = await client.user.findUnique({ where: { username } });
  if (!user) return c.body(null, 401);
  const like = await client.like.delete({
    where: { userId_blogId: { userId: user.id, blogId: +c.req.param("id") } },
  });
  return c.json({ id: like.id });
});

blogRouter.post("/:id/dislike", async (c) => {
  const username = c.req.headers.get("x-username")!;
  const user = await client.user.findUnique({ where: { username } });
  if (!user) return c.body(null, 401);
  await safe(async () => {
    await client.like.delete({
      where: { userId_blogId: { userId: user.id, blogId: +c.req.param("id") } },
    });
  });
  await client.dislike.create({
    data: { blogId: +c.req.param("id"), userId: user.id },
  });
  return c.body(null, 201);
});

blogRouter.delete("/:id/un-dislike", async (c) => {
  const username = c.req.headers.get("x-username")!;
  const user = await client.user.findUnique({ where: { username } });
  if (!user) return c.body(null, 401);
  const dislike = await client.dislike.delete({
    where: { userId_blogId: { userId: user.id, blogId: +c.req.param("id") } },
  });
  return c.json({ id: dislike.id });
});

async function safe(callback: () => void | Promise<void>) {
  try {
    await callback();
  } catch (_) {}
}
