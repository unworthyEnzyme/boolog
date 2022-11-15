import { DataSource } from "typeorm";
import { User } from "typeorm-entities";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.db",
  entities: [User],
  synchronize: true,
});
