export interface SessionStore {
  get(id: string): Promise<{ username: string } | null | undefined>;
  set(username: string, expiresAt: Date): Promise<string>;
}
