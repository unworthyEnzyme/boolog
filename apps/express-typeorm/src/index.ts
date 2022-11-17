import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { connect } from "mongo-session";
import authRoute from "./routes/auth";

const main = async () => {
  const app = express();
  app.use(express.json());
  app.use("/auth", authRoute);
  app.get("/", (_, res) => res.json({ hello: "world" }));
  await AppDataSource.initialize();
  await connect();
  app.listen(process.env.PORT || 3000, () => {
    console.log(`http://localhost:${process.env.PORT || 3000}`);
  });
};

main();
