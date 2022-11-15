import express from "express";
import { AppDataSource } from "./data-source";

const main = async () => {
  const app = express();
  app.get("/", (_, res) => res.json({ hello: "world" }));
  await AppDataSource.initialize();
  app.listen(process.env.PORT || 3000, () => {
    console.log(`http://localhost:${process.env.PORT || 3000}`);
  });
};

main();
