import express from "express";
import { AppDataSource } from "./data-source";
import { connect } from "mongo-session";
import authRoute from "./routes/auth";
import blogRouter from "./routes/blog";
import cookieParser from "cookie-parser";

const main = async () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/auth", authRoute);
  app.use("/blogs", blogRouter);
  app.get("/", (_, res) => res.json({ hello: "world" }));
  await AppDataSource.initialize();
  await connect();
  app.listen(process.env.PORT || 3000, () => {
    console.log(`http://localhost:${process.env.PORT || 3000}`);
  });
};

main();
