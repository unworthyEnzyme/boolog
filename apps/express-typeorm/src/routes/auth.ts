import { Router } from "express";
import { SignupRequestSchema, LoginRequestSchema } from "types-on-wire";
import { AuthSession } from "mongo-session";
import { User } from "typeorm-entities";
import argon2 from "argon2";

const router = Router();

router.post("/signup", async (req, res) => {
  let username: string | undefined;
  let password: string | undefined;
  try {
    const parsed = SignupRequestSchema.parse(req.body);
    username = parsed.username;
    password = parsed.password;
  } catch (err) {
    res.sendStatus(400);
    return;
  }
  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
  });
  const user = new User();
  user.username = username;
  user.password = hashedPassword;
  try {
    await user.save();
    res.sendStatus(201);
  } catch (err) {
    res.sendStatus(400);
  }
});

router.post("/login", async (req, res) => {
  let username: string | undefined;
  let password: string | undefined;
  try {
    const parsed = LoginRequestSchema.parse(req.body);
    username = parsed.username;
    password = parsed.password;
  } catch (err) {
    res.sendStatus(400);
    return;
  }
  const user = await User.findOneBy({ username });
  let verified: boolean;
  try {
    verified = await argon2.verify(user?.password ?? "$", password);
  } catch (err) {
    res.sendStatus(400);
    return;
  }
  res.sendStatus(verified ? 200 : 400);
});

export default router;
