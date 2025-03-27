import mongoose, {Schema,models,model} from "mongoose";
import type { IUser } from "@/models/User";

export interface IChats {
  _id?: mongoose.Types.ObjectId;
  chatTitle: string;
  messages: {
    text: string;
    sender: "AI" | "User";
    timestamp: Date;
  }[];
  userId: mongoose.Types.ObjectId | IUser
  createdAt: Date;
  updatedAt: Date;
}

const ChatsSchema = new Schema<IChats>(
  {
    chatTitle: { type: String, required: true },
    messages: [
      {
        text: { type: String, required: true },
        sender: { type: String, required: true,  enum: ["AI", "User"] },
        timestamp: { type: Date, required: true },
      },
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

export const Chats = models?.Chats || model<IChats>("Chats", ChatsSchema);
