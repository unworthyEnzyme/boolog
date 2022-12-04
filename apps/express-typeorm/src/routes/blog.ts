import { Router } from "express";
import { Blog, User } from "typeorm-entities";
import { CreateBlogRequestSchema } from "types-on-wire";
import { authenticated } from "../middlewares";

const router = Router();

router.get("/:id", (req, res) => {
  Blog.findOne({
    select: { id: true, content: true, author: { id: true, username: true } },
    relations: { author: true },
    where: { id: +req.params.id },
  })
    .then((v) => (v === null ? res.sendStatus(404) : res.json(v)))
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

router.get("/", (req, res) => {
  Blog.find({
    select: { id: true, content: true, author: { id: true, username: true } },
    relations: { author: true },
  })
    .then((v) => res.json(v))
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

router.post("/", authenticated, (req, res) => {
  CreateBlogRequestSchema.parseAsync(req.body)
    .then(({ content }) => {
      const blog = new Blog();
      blog.content = content;
      return blog;
    })
    .then((blog) => {
      //@ts-ignore
      const user = req.user as User;
      blog.author = user;
      return blog.save();
    })
    .then((saved) => {
      res.json({ id: saved.id });
    })
    .catch((e: Error) => {
      res.sendStatus(400);
    });
});

export default router;
