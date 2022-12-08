import { client } from "./redis";
import { RedisSessionStore } from "./RedisSessionStore";

export const sessionStore = new RedisSessionStore(client);
