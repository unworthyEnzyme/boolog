import { DataSource } from "typeorm";
import { User, Blog, Dislike, Like, Comment } from "typeorm-entities";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.db",
  entities: [User, Blog, Like, Dislike, Comment],
  synchronize: true,
  logging: true,
});
