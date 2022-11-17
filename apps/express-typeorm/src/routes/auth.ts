import { Router } from "express";
import { SignupRequestSchema, LoginRequestSchema } from "types-on-wire";
import { AuthSession } from "mongo-session";
import { User } from "typeorm-entities";
import argon2 from "argon2";

const router = Router();

router.post("/signup", async (req, res) => {
  SignupRequestSchema.parseAsync(req.body)
    .then(async (v) => {
      const hashed = await argon2.hash(v.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
      });
      return { username: v.username, password: hashed };
    })
    .then((v) => {
      const user = new User();
      user.username = v.username;
      user.password = v.password;
      return user;
    })
    .then((v) => v.save())
    .then(() => res.sendStatus(201))
    .catch((e) => res.sendStatus(400));
});

router.post("/login", async (req, res) => {
  LoginRequestSchema.parseAsync(req.body)
    .then(async (v) => {
      const user = await User.findOneBy({ username: v.username });
      return { user, reqPassword: v.password };
    })
    .then((v) => argon2.verify(v.user?.password ?? "$", v.reqPassword))
    .then((v) => res.sendStatus(v ? 200 : 400))
    .catch((e) => res.sendStatus(400));
});

export default router;
