import mongoose from "mongoose";
import crypto from "crypto";
import * as fns from "date-fns";
const SECOND = 1;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const authSessionSchema = new mongoose.Schema(
  {
    id: {
      required: true,
      type: String,
    },
    username: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

authSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: DAY });

export const AuthSession = mongoose.model("AuthSession", authSessionSchema);

export async function connect() {
  await mongoose.connect(`mongodb://127.0.0.1:27017`);
}

export async function disconnect() {
  await mongoose.disconnect();
}

export async function createSession(username: string) {
  const id = crypto.randomBytes(16).toString("base64");
  const expirationDate = fns.add(new Date(), { days: 1 });
  const session = await AuthSession.create({ id, username });
  await session.save();
  return { id, expirationDate };
}

export async function getSessionById(id: string) {
  return await AuthSession.findOne({ id });
}

export async function getSessions(username: string) {
  return await AuthSession.find({ username });
}
