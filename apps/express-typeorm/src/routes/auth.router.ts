import { Router } from "express";
import { SignupRequestSchema } from "types-on-wire";

const router = Router();

router.post("/signup", async (req, res) => {
  const { username, password } = SignupRequestSchema.parse(req.body);
});
router.post("/login", async (req, res) => {});

export default router;
