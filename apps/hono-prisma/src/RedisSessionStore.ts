import { client } from "./redis";
import type { SessionStore } from "./SessionStore";
import * as crypto from "node:crypto";

type RedisClient = typeof client;

export class RedisSessionStore implements SessionStore {
  private client: RedisClient;
  constructor(client: RedisClient) {
    this.client = client;
  }

  async get(id: string): Promise<{ username: string } | null | undefined> {
    const session = await this.client.get(`session:${id}`);
    return session && JSON.parse(session);
  }

  async set(username: string, expiresAt: Date): Promise<string> {
    const id = crypto.randomBytes(16).toString("base64url");
    await this.client.set(`session:${id}`, JSON.stringify({ username }));
    await this.client.expireAt(`session:${id}`, expiresAt);
    return id;
  }
}
