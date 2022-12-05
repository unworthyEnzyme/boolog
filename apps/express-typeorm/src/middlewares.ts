import { NextFunction, Request, Response } from "express";
import { getSessionById } from "mongo-session";
import { User } from "typeorm-entities";

export const authenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sessionId } = req.cookies;
  if (!sessionId) return res.sendStatus(401);
  getSessionById(sessionId)
    .then((session) => {
      if (!session) throw new Error("No Session");
      return session;
    })
    .then((session) => {
      return User.findOneBy({ username: session.username });
    })
    .then((user) => {
      if (!user) throw new Error("No User");
      //@ts-ignore
      req.user = user;
      next();
    })
    .catch((e: Error) => {
      res.sendStatus(401);
    });
};
