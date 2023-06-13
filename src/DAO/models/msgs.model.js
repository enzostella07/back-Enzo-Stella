import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  user: { type: String, required: true, max: 100 },
  message: { type: String, required: true, max: 100 },
});

export const MsgModel = model("messages", messageSchema);
