import { DataSource } from "typeorm";
import { User } from "typeorm-entities";

export const AppDataSource = new DataSource({
  type: "sqlite",
  logging: true,
  database: "db.db",
  entities: [User],
  synchronize: true,
});
