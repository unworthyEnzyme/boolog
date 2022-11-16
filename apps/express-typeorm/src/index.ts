import express from "express";
import { AppDataSource } from "./data-source";
import { connect } from "mongo-session";

const main = async () => {
  const app = express();
  app.use(express.json());
  app.get("/", (_, res) => res.json({ hello: "world" }));
  await AppDataSource.initialize();
  await connect();
  app.listen(process.env.PORT || 3000, () => {
    console.log(`http://localhost:${process.env.PORT || 3000}`);
  });
};

main();
