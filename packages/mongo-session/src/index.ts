import mongoose from "mongoose";
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
