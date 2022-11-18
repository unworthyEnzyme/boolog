import { Router } from "express";
import { SignupRequestSchema, LoginRequestSchema } from "types-on-wire";
import { createSession } from "mongo-session";
import { User } from "typeorm-entities";
import argon2 from "argon2";
import DeferredPromise from "deferred-promise";

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
    .then(async (v) => {
      const session = await createSession(v.username).catch((e) => null);
      if (!session) return;
      res.set(
        "Set-Cookie",
        `sessionId=${
          session.id
        }; Expires=${session.expirationDate.toISOString()}; HttpOnly; Secure; Path=/`
      );
    })
    .then(() => res.sendStatus(201))
    .catch((e) => res.sendStatus(400));
});

router.post("/login", async (req, res) => {
  const username = new DeferredPromise<string>();
  LoginRequestSchema.parseAsync(req.body)
    .then(async (v) => {
      const user = await User.findOneBy({ username: v.username });
      return { user, reqPassword: v.password };
    })
    .then(async (v) => {
      const verified = await argon2.verify(
        v.user?.password ?? "$",
        v.reqPassword
      );
      username.resolve(v.user!.username);
      return verified;
    })
    .then(async (v) => {
      const session = await createSession((await username) as string).catch();
      if (!session) return v;
      res.set(
        "Set-Cookie",
        `sessionId=${
          session.id
        }; Expires=${session.expirationDate.toISOString()}; HttpOnly; Secure; Path=/`
      );
      return v;
    })
    .then((v) => res.sendStatus(v ? 200 : 400))
    .catch((e) => res.sendStatus(400));
});

export default router;
