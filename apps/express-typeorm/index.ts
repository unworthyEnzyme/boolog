import express from "express";

const main = async () => {
  const app = express();
  app.get("/", (_, res) => res.json({ hello: "world" }));
  app.listen(process.env.PORT || 3000, () => {
    console.log(`http://localhost:${process.env.PORT || 3000}`);
  });
};

main();
